(function () {
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

  let uids = [];
  let students = [];
  let assignments = [];

  fetch(`https://my.learn.co/courses/${courseId}/gradebook/user_ids`)
    .then((r) => r.json())
    .then((data) => {
      uids = data.user_ids;
      console.log(uids);
    });
})();
