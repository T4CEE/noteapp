exports.dashboard = async (req, res) => {
  const locals = {
    title: "Dashboard",
    description: "My Note App",
  };
  res.render("dashboard/index", {
    locals,
    layout: "../views/layouts/dashboard",
  });
};
