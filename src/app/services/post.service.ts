import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Post } from '../model/post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl+'/posts/';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[];
  private subject = new Subject<{ posts: Post[]; postCount: number }>();
  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string; posts: any; maxPosts: number }>(API_URL + queryParams)
     .pipe(map(postData => {
      return {
        posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }),
        maxPosts: postData.maxPosts
      };
    }))
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.subject.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
  }

  getPost(id: string) {
    return { ...this.posts.find(p => p.id === id) };
  }

  addNewPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);
    console.log(postData);
    this.http.post<{message: string, post: Post}>(API_URL, postData)
    .subscribe((res) => {
      this.router.navigate(['/']);
    });

  }
  fetchPosts(): Observable<{ posts: Post[]; postCount: number }> {
    return this.subject.asObservable();
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(API_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      },
      error => {

      });

  }

  deletePost(id: string) {
    return this.http.delete(API_URL + id)
  }
}
