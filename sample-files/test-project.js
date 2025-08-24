// Test script to validate the SCE Advanced project
const http = require("http");

console.log("🧪 Testing SCE Advanced Project...\n");

// Test Backend Health
function testBackendHealth() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/api/health",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          console.log("✅ Backend Health Check:", response.status);
          console.log("   Message:", response.message);
          console.log("   Timestamp:", response.timestamp);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      console.log("❌ Backend Health Check Failed:", error.message);
      reject(error);
    });

    req.end();
  });
}

// Test Frontend Availability
function testFrontendAvailability() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      console.log("✅ Frontend Available - Status Code:", res.statusCode);
      console.log("   Content-Type:", res.headers["content-type"]);
      resolve(res.statusCode);
    });

    req.on("error", (error) => {
      console.log("❌ Frontend Not Available:", error.message);
      reject(error);
    });

    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    console.log("1. Testing Backend...");
    await testBackendHealth();

    console.log("\n2. Testing Frontend...");
    await testFrontendAvailability();

    console.log("\n🎉 All tests passed! SCE Advanced is working properly.");
    console.log("\n📱 Access the application at: http://localhost:3000");
    console.log("🔧 Backend API available at: http://localhost:5000");
  } catch (error) {
    console.log("\n❌ Tests failed:", error.message);
    console.log(
      "\nPlease ensure both frontend and backend servers are running."
    );
  }
}

runTests();
