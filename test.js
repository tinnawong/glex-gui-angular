const { exec } = require("child_process");

cmdKill = ' taskkill /FI "WindowTitle eq main server(python) *" /T /F &&\
            taskkill /FI "WindowTitle eq glex server(golang) *" /T /F'
exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.log(error);
    return;
  }
  if (stderr) {
    console.log(stderr);
    return;
  }
  console.log(stdout);
});