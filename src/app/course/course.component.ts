import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import { finalize, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Lesson } from "../model/lesson";
import { CoursesService } from "src/services/courses.service";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
  course: Course;
  lessons: Lesson[];
  loading = false;

  displayedColumns = ["seqNo", "description", "duration"];

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    this.course = this.route.snapshot.data["course"];
    this.coursesService
      .findLessons(this.course.id)
      .subscribe((lessons) => (this.lessons = lessons));
  }
}
