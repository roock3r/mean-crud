import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl : './post-list.component.html',
  styleUrls : ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPost = 1000;
  postsPerPage = 50;
  pageSizeOptions = [10, 25, 50, 100, 200 , 500];
  private postsSub: Subscription;
  constructor(public postService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onChangePage(pageData: PageEvent){
    console.log(pageData);
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
