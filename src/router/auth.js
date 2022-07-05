export function failedLogin(to, from, next) {
  return s => {
    localStorage.setItem("uaskRedirectCallback", JSON.stringify(to));
    next({
      name: "Callback",
      query: {
        redirect_uri: "/callback",
        ...s,
        ...makeContext(to)
      }
    });
  };
}

function makeContext(to) {
  const context = {};
  if (to.params.participantCode)
    context.participantCode = to.params.participantCode;
  if (to.params.survey) context.survey = to.params.survey;
  if (to.query.survey) context.survey = to.query.survey;
  if (to.query.m) context.magic = to.query.m;
  return context;
}
