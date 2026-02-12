const users = [
  {
    email: "vindiainfrasec@admin",
    password: "Admin@123",
    role: "admin",
    name: "Admin"
  },
  {
    email: "vindiainfrasec@bda1",
    password: "Bda1@123",
    role: "bda",
    name: "BDA User1"
  },
  {
    email: "vindiainfrasec@bda2",
    password: "Bda2@123",
    role: "bda",
    name: "BDA User 2"
  }
];

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    success: true,
    user: {
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
};
