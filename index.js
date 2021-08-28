(function () {
  let courseId = checkAndGetCourseID();

  fetch(`https://my.learn.co/courses/${courseId}/gradebook/user_ids`)
    .then((r) => r.json())
    .then((data) => {
      window.uids = data.user_ids;
      return window.uids;
    })
    .then((uids) => {
      fetchStudents(uids)
        .then((students) => {
          window.students = students;
          return uids;
        })
        .then((uids) => {
          fetchSubmissions(uids).then((subs) => {
            window.submissions = submissions;
            runOnLoad();
          });
        });
    });
})();

function runOnLoad() {
  console.log(window.submissions);
}

async function fetchSubmissions(uids) {
  let url = "https://my.learn.co/api/v1/courses/146/students/submissions";
  const params = {
    exclude_response_fields: ["preview_url"],
    grouped: 1,
    response_fields: [
      "assignment_id",
      "attachments",
      "cached_due_date",
      "entered_grade",
      "entered_score",
      "excused",
      "grade",
      "grade_matches_current_submission",
      "grading_period_id",
      "id",
      "late",
      "late_policy_status",
      "missing",
      "points_deducted",
      "posted_at",
      "score",
      "seconds_late",
      "submission_type",
      "submitted_at",
      "url",
      "user_id",
      "workflow_state",
    ],
    per_page: 100,
    student_ids: [],
  };

  let submissions = [];

  for (let i = 0; i < Math.ceil(uids.length / 10); i++) {
    let start = i * 10;
    let end = start + 10;
    let p = { ...params, student_ids: uids.slice(start, end) };
    let u = url + "?" + paramsToURL(p);

    let subs = await fetch(u).then((r) => r.json());
    submissions = submissions.concat(subs);
  }

  return submissions;
}

function paramsToURL(params) {
  let ret = "";
  for (let key in params) {
    let p = params[key];
    if (Array.isArray(p)) {
      ret += ret[ret.length - 1] === "&" || ret.length === 0 ? "" : "&";
      ret += `${key}[]=` + p.join(`&${key}[]=`);
    } else {
      ret += `&${key}=${p}`;
    }
  }

  if (ret[ret.length - 1] === "&") {
    ret.substr(0, ret.length - 1);
  }
  return ret;
}

function fetchStudents(uids) {
  let url = "https://my.learn.co/api/v1/courses/146/users";
  const params = {
    enrollment_state: ["active", "completed", "inactive", "invited"],
    enrollment_type: ["student", "student_view"],
    include: ["avatar_url"],
    per_page: 200,
    user_ids: [...uids],
  };

  url += "?" + paramsToURL(params);
  return fetch(url).then((r) => r.json());
}

function checkAndGetCourseID() {
  const location = window.location;
  const locationRegx = /courses\/(\d+)\/gradebook/;
  const matches = location.pathname.match(locationRegx);
  if (matches.length <= 0) {
    alert(
      "This tool can be used in Canvas only. Please head to your course grades page in Canvas dashboard."
    );
    return;
  }

  let courseId = matches.pop();
  if (parseInt(courseId) === NaN) {
    courseId = prompt(
      "Cannot find course id! Please enter it below. It should be in the URL of this page"
    );
  }

  return courseId;
}
