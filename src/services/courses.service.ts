import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, from } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { Course } from "src/app/model/course";
import { convertSnaps } from "./db-utils";
import { Lesson } from "src/app/model/lesson";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private db: AngularFirestore) {}
  findLessons(
    courseId: string,
    sortOrder = "asc",
    pageNumber = 0,
    pageSize = 3
  ) {
    return this.db
      .collection(`courses/${courseId}/lesons`, (ref) =>
        ref
          .orderBy("seqNo, sortOrder")
          .limit(pageSize)
          .startAfter(pageNumber * pageSize)
      )
      .get()
      .pipe(map((results) => convertSnaps<Lesson>(results)));
  }
  loadCoursesByCategory(category: string): Observable<Course[]> {
    return this.db
      .collection("courses", (ref) =>
        ref.where("categories", "array-contains", category).orderBy("seqNo")
      )
      .get()
      .pipe(map((res) => convertSnaps<Course>(res)));
  }
  deleteCourseAndLessons(courseId: string) {
    return this.db
      .collection(`courses/'${courseId}/lessons`)
      .get()
      .pipe(
        concatMap((results) => {
          const lessons = convertSnaps<Lesson>(results);
          const batch = this.db.firestore.batch();
          const courseRef = this.db.doc(`courses/'${courseId}`).ref;
          batch.delete(courseRef);
          for (let lesson of lessons) {
            const lesonRef = this.db.doc(
              `courses/'${courseId}/lessons/${lesson.id}`
            ).ref;
            batch.delete(lesonRef);
          }
          return from(batch.commit());
        })
      );
  }
  createCourse(newCourse: Partial<Course>, courseId?: string) {
    return this.db
      .collection("courses", (ref) => ref.orderBy("seqNo", "desc").limit(1))
      .get()
      .pipe(
        concatMap((result) => {
          const courses = convertSnaps<Course>(result);
          const lastCourseSeqNo = courses[0]?.seqNo ?? 0;
          const course = {
            ...newCourse,
            seq: lastCourseSeqNo + 1,
          };
          let save$: Observable<any>;
          if (courseId) {
            save$ = from(this.db.doc(`courses/${courseId}`).set(course));
          } else {
            save$ = from(this.db.collection("courses").add(course));
          }
          return save$.pipe(
            map((res) => {
              return {
                id: courseId ?? res.id,
                ...course,
              };
            })
          );
        })
      );
  }
  updateCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return from(this.db.doc(`courses/${courseId}`).update(changes));
  }

  deleteCourse(courseId: string) {
    return from(this.db.doc(`courses/'${courseId}`).delete());
  }

  findCourseByUrl(courseUrl: string) {
    return this.db
      .collection("courses", (ref) => ref.where("url", "==", courseUrl))
      .get()
      .pipe(
        map((result) => {
          const courses = convertSnaps<Course>(result);
          return courses.length == 1 ? courses[0] : null;
        })
      );
  }
}
