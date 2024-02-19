import app from "./server.js";
import supertest from "supertest";
const request = supertest(app);

describe("Test endpoints", () => {
  it("gets the test endpoint", async () => {
    const response = await request.get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("ello from backend ");
  });
  it("gets the /ask endpoint", async () => {
    const response = await request.post("/ask").send({
      length: 5,
      topic: "javascript",
      expertise: "beginner",
      style: "nerdy",
    });

    expect(response.status).toBe(200);
    // expect(response.body).toBeDefined();
  });
  it("gets the /grade endpoint", async () => {
    const response = await request.post("/grade").send({
      question: "What are the pillars of OOP?",
      answer: "Encapsulation, Inheritance, Polymorphism, Abstraction",
    });
    expect(response.status).toBe(200);
  });

  it("checks if /ask endpoint has a prompt", async () => {
    // this will check app.js for the prompt
    const response = await request.post("/ask").send({
      length: 5,
      topic: "javascript",
      expertise: "beginner",
      style: "cowboy",
    });
    expect(response.text).toContain(`"role":"assistant"`);


  })

  it('checks if error for non-existent route', async () => {
    const response = await request.get('/nonexistent')
    expect(response.status).toBe(404)
  } )


});


// )});
