(function () {
  const location = window.location.split('/')
  if(!location.includes('courses') && !location.includes('gradebook')) {
    alert("This tool can be used in Canvas only. Please head to your course grades page in Canvas dashboard.")
    return;
  }

  const cidRgx = /courses\/(\d+)\/gradebook/g
  let courseId = window.location.pathname.match(cidRgx).pop()
  if (parseInt(courseId) === NaN) {
    courseId = prompt("Cannot find course id! Please enter it below. It should be in the URL of this page")
  }

  let uids = []
  let students = [];
  let assignments = [];

  fetch(`https://my.learn.co/courses/${courseId}/gradebook/user_ids`).then(r => r.json()).then(data => {
    uids = data.user_ids
    console.log(uids)
  })

})();
