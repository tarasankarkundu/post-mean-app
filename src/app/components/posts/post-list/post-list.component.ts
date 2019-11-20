import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/model/post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  private subscription: Subscription;
  private authStatusSub: Subscription;
  isLoggedIn = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userId: string;

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit() {
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.subscription = this.postService.fetchPosts().subscribe((data) => {
      this.isLoading = false;
      this.totalPosts = data.postCount;
      this.posts = data.posts;
    });
    this.isLoggedIn = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      console.log(isAuthenticated);
      this.isLoggedIn = isAuthenticated;
      this.userId = this.authService.getUserId();
      console.log(this.isLoggedIn);
    })
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDeletePost(id: string) {
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
