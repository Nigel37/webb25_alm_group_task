import "../test-setup";
import { describe, it, expect } from "vitest";
import User from "../../src/models/User.js";

describe("User Model", () => {
  it("should create a user", async () => {
    const user = await User.create({
      username: "ahmed_alhassan",
      email: "ahmed.hassan@email.com",
      profileImage: "https://avatar.example.com/ahmed-profile.jpg",
    });

    expect(user).toBeDefined();
    expect(user.username).toBe("ahmed_alhassan");
    expect(user.email).toBe("ahmed.hassan@email.com");
    expect(user.profileImage).toBe("https://avatar.example.com/ahmed-profile.jpg");
  });

  // TODO: Test that email must be unique
  it("should require unique email", async () => {
    await User.create({
      username: "fatima_ali",
      email: "fatima.ali@workplace.com",
      profileImage: "https://cdn.example.com/fatima-avatar.webp",
    });

    await expect(
      User.create({
        username: "omar_salem",
        email: "fatima.ali@workplace.com",
        profileImage: "https://cdn.example.com/omar-avatar.webp",
      })
    ).rejects.toThrow();
  });

  // TODO: Test that username must be unique
  it("should require unique username", async () => {
    await User.create({
      username: "khalid_mohammed",
      email: "khalid.m@outlook.com",
      profileImage: "https://profile.example.com/khalid.jpg",
    });

    await expect(
      User.create({
        username: "khalid_mohammed",
        email: "khalid.m.alt@gmail.com",
        profileImage: "https://profile.example.com/khalid-alt.jpg",
      })
    ).rejects.toThrow();
  });

  // TODO: Test that email format is validated
  it("should validate email format", async () => {
    await expect(
      User.create({
        username: "invalid_format",
        email: "this-is-not-a-valid-email-address",
        profileImage: "https://img.example.com/profile.jpg",
      })
    ).rejects.toThrow();
  });

  // TODO: Test that profileImage is a valid URL
  it("should validate profileImage as a valid URL", async () => {
    await expect(
      User.create({
        username: "url_test_user",
        email: "urltest@domain.com",
        profileImage: "this-is-definitely-not-a-valid-url-string",
      })
    ).rejects.toThrow();
  });
});
