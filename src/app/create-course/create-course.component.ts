import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import firebase from "firebase/app";
import { catchError, tap } from "rxjs/operators";
import { CoursesService } from "src/services/courses.service";
import { Course } from "../model/course";
import Timestamp = firebase.firestore.Timestamp;
import { throwError } from "rxjs";

@Component({
  selector: "create-course",
  templateUrl: "create-course.component.html",
  styleUrls: ["create-course.component.css"],
})
export class CreateCourseComponent implements OnInit {
  form = this.fb.group({
    description: ["", Validators.required],
    category: ["BEGINNER", Validators.required],
    url: ["", Validators.required],
    longDescription: ["", Validators.required],
    promo: [false],
    promoStartAt: [null],
  });

  courseId: string;

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.courseId = this.afs.createId();
  }
  onCreateCourse() {
    const val = this.form.value;
    const newCourse: Partial<Course> = {
      ...val,
      categories: [val.category],
    };
    newCourse.promoStartAt = Timestamp.fromDate(
      this.form.value.newCourse?.promoStartAt
    );

    this.coursesService
      .createCourse(newCourse, this.courseId)
      .pipe(
        tap((course) => {
          this.router.navigateByUrl("/courses");
        }),
        catchError((err) => {
          console.log(err);
          alert("Could not create the course");
          return throwError(err);
        })
      )
      .subscribe();
  }
}
