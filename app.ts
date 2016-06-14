/// <reference path="node_modules/angular2/ts/typings/node/node.d.ts"/>
/// <reference path="node_modules/angular2/typings/browser.d.ts"/>

import { bootstrap } from "angular2/platform/browser";
import { Component } from "angular2/core";

class Article {
  title: string;
  link: string;
  votes: number;

  constructor(title: string, link: string, votes?: number) {
    this.title = title;
    this.link = link;
    this.votes = votes || 0;
  }

  voteUp(): void {
    this.votes += 1;
  }

  voteDown(): void {
    this.votes -= 1;
  }

  domain(): string {
    try {
      const link: string = this.link.split('//')[1];
      return link.split('/')[0];
    } catch (err) {
      return null;
    }
  }


}

@Component({
  selector: 'reddit-article',
  inputs: ['articleInput'],
  host: {
    class: 'row'
  },
  template: `
    <div class="four wide column center aligned votes">
      <div class="ui statistic">
        <div class="value">
          {{ articleInput.votes }}
        </div>
        <div class="label">
          Points
        </div>
      </div>
    </div>
    <div class="twelve wide column">
      <a class="ui large header" href="{{ articleInput.link }}">
        {{ articleInput.title }}
      </a>
      
      <div class="meta">({{ articleInput.domain() }})</div>
      <ul class="ui big horizontal list voters">
        <li class="item">
          <a href (click) = "$event.preventDefault() || voteUp()">
            <i class="arrow up icon"></i>
            upvote
          </a>
        </li>
        <li class="item">
          <a href (click) = "$event.preventDefault() || voteDown()">
            <i class="arrow down icon"></i>
            downvote
          </a>
        </li>
      </ul>
    </div>
  `
})

class ArticleComponent {
  articleInput: Article;

  voteUp(): void {
    this.articleInput.voteUp();
  }

  voteDown(): void {
    this.articleInput.voteDown();
  }

}

@Component({
  selector: 'reddit',
  directives: [ArticleComponent],
  template: `
  <form class="ui large form segment">
    <h3 class="ui header">Add a Link</h3>
    <div class="field">
      <label for="title">Title:</label>
      <input name="title" #newtitle>
    </div>
    <div class="field">
      <label for="link">Link:</label>
      <input name="link" #newlink> 
    </div>
    <button (click)="addArticle(newtitle, newlink)"
      class="ui positive right floated button">
      Submit Link
    </button>
  </form>
  <!-- adding the article list -->
  <div class="ui grid posts">
    <reddit-article *ngFor="#articleItem of sortedArticles()" [articleInput]="articleItem"></reddit-article>
  </div>
  `
})

class RedditApp {
  articles: Article[];
  constructor(){
    this.articles = [
        new Article('Angular 2', 'http://angular.io', 3),
        new Article('Fullstack', 'http://fullstack.io', 2),
        new Article('Angular Hompage', 'http://angularjs.org', 5)
      ];
  }

  addArticle(title: HTMLInputElement, link: HTMLInputElement): void {
    console.log(`Adding article title: `+title.value+` and link: `+link.value);
    this.articles.push(new Article(title.value, link.value, 0));
    title.value = '';
    link.value= '';
  }
  
  sortedArticles(): Article[] {
    return this.articles.sort((a: Article, b: Article) => b.votes - a.votes);
  }
}

bootstrap(RedditApp);
