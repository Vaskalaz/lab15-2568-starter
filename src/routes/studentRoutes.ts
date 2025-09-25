import { Router, type Request, type Response } from "express";
import { zStudentId } from "../schemas/studentValidator.js";
import { courses, students } from "../db/db.js";

const routerS = Router();

routerS.get("/students/:studentId/courses", (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const result = zStudentId.safeParse(studentId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: result.error.issues[0]?.message,
      });
    }
    const foundIndex = students.findIndex(
      (student) => student.studentId === studentId
    );
    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Student does not exist",
      });
    }
    const filteredCourses = courses.filter((course) =>
      students[foundIndex]?.courses?.includes(course.courseId)
    );
    res.set("Link", `/students/${studentId}/courses`);

    return res.status(200).json({
      success: true,
      message: `Get courses of student ${studentId}`,
      data: {
        studentId: studentId,
        courses: filteredCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error: error,
    });
  }
});

export default routerS;
