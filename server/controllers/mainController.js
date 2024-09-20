exports.homepage = async (req, res) => {
  const locals = {
    title: "My Note App",
    description: "My Note App",
  };
  res.render("index", locals);
};

//get about page
exports.about = async (req, res) => {
  const locals = {
    title: "My Note App",
    description: "My Note App",
  };
  res.render("about", locals);
};
