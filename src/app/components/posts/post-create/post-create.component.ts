import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/model/post.model';
import { PostService } from 'src/app/services/post.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { INVALID } from '@angular/forms/src/model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post: Post;
  private mode = 'create';
  private postId: string;
  imagePreview: string;
  isLoading = false;
  postForm: FormGroup;
  private authStatusSub: Subscription;
  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.postForm = new FormGroup({
      postTitle : new FormControl('', [Validators.required, Validators.maxLength(30)]),
      postContent: new FormControl('', Validators.required),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post = this.postService.getPost(this.postId);
        this.postForm.setValue({
          postTitle : this.post.title,
          postContent: this.post.content,
          image: this.post.imagePath
        });
      } else {
        this.mode = 'create';
      }
    });

  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({ image: file });
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  resetForm(formGroup: FormGroup) {
    let control: AbstractControl = null;
    formGroup.reset();
    formGroup.markAsUntouched();
    formGroup.setErrors({ invalid: true });
    Object.keys(formGroup.controls).forEach((name) => {
      control = formGroup.controls[name];
      control.setErrors(null);
    });
  }

  addPost() {
    console.log(this.postForm.get('image').value);
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addNewPost(
        this.postForm.value.postTitle,
        this.postForm.value.postContent,
        this.postForm.value.image
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.postForm.value.postTitle,
        this.postForm.value.postContent,
        this.postForm.value.image
      );
    }
    this.resetForm(this.postForm);

  }

}
