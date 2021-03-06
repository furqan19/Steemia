import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';
import { Post } from 'models/models';
import { SteemProvider } from '../../../providers/steem/steem';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-promoted',
  templateUrl: 'promoted.html',
})
export class PromotedPage implements OnInit, OnDestroy {

  private destroyed$: Subject<{}> = new Subject();
  private contents: Array<Post> = [];
  private perPage = 10;

  constructor(public appCtrl: App,
              private steemProvider: SteemProvider) { 

  }

  public ngOnInit() {
    this.getPromoted()
    .takeUntil( this.destroyed$ )
    .subscribe((data: Array<Post>) => {
      this.contents = data;
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(); /* Emit a notification on the subject. */
    this.destroyed$.complete();
  }
  
  /**
   * 
   * Method to get posts filtered by promoted
   * 
   * @returns Observable with an array of posts
   * @author Jayser Mendez.
   */
  private getPromoted(): Observable<Array<Post>> {
    return this.steemProvider.getByPromoted({tag:"", limit: this.perPage})
  }

  /**
   * 
   * Method to refresh the current post for future data.
   * 
   * @param {Event} refresher
   */
  private doRefresh(refresher): void {
    this.getPromoted()
    .takeUntil( this.destroyed$ )
    .subscribe((data: Array<Post>) => {
      this.contents = data;
      refresher.complete();
    });
  }

  /**
   * 
   * Method to load data while scrolling.
   * 
   * @param {Event} infiniteScroll
   */
  private doInfinite(infiniteScroll): void {
    this.perPage += 10;
    this.getPromoted()
    .takeUntil( this.destroyed$ )
    .subscribe((data: Array<Post>) => {
      this.contents = data;
      infiniteScroll.complete();
    });
  }

  /**
   * @method openPage: Method to push a page to the nav controller
   * @param {string} str: the name of the page to push
   */
  private openPage(str: string): void {
    this.appCtrl.getRootNavs()[0].push(str);
  }

}
