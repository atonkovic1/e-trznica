const express = require("express");
const compression = require("compression");
const path = require("path");

const ENV = process.env.NODE_ENV;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

// API routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/register_page", require("./routes/api/register_page"));
app.use(
	"/api/admin_page_categories",
	require("./routes/api/admin_page_categories")
);
app.use("/api/admin_page_units", require("./routes/api/admin_page_units"));
app.use(
	"/api/admin_page_post_offices",
	require("./routes/api/admin_page_post_offices")
);
app.use(
	"/api/admin_page_counties",
	require("./routes/api/admin_page_counties")
);
app.use(
	"/api/farmer_profile_page",
	require("./routes/api/farmer_profile_page")
);
app.use(
	"/api/customer_profile_page",
	require("./routes/api/customer_profile_page")
);
app.use("/api/product_page", require("./routes/api/product_page"));
app.use("/api/products_page", require("./routes/api/products_page"));
app.use("/api/farmers_page", require("./routes/api/farmers_page"));
app.use("/api/shopping_cart_page", require("./routes/api/shopping_cart_page"));

// If in production, get files from the build folder
if (ENV === "production") {
	app.use(express.static(path.join(__dirname, "/../client/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "/../client/build/index.html"));
	});
}

module.exports = app;
