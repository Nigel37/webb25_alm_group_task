import "../test-setup";
import { describe, it, expect } from "vitest";
import Accommodation from "../../src/models/Accommodation.js";
import User from "../../src/models/User.js";

describe("Accommodation Model", () => {
  it("should create an accommodation", async () => {
    const user = await User.create({
      username: "property_owner_ali",
      email: "ali.properties@rentals.se",
      profileImage: "https://avatars.example.com/ali-owner.webp",
    });

    const acc = await Accommodation.create({
      address: "Södermalmvägen 45, lägenhet 201",
      city: "Stockholm",
      country: "Sweden",
      postalCode: "11863",
      rent: 14500,
      rooms: 4,
      userId: user._id,
    });

    expect(acc).toBeDefined();
    expect(acc.address).toBe("Södermalmvägen 45, lägenhet 201");
    expect(acc.city).toBe("Stockholm");
    expect(acc.country).toBe("Sweden");
    expect(acc.postalCode).toBe("11863");
    expect(acc.rent).toBe(14500);
    expect(acc.rooms).toBe(4);
    expect(acc.userId.toString()).toBe(user._id.toString());
  });

  it("should require all fields", async () => {
    await expect(
      Accommodation.create({
        city: "Göteborg",
      })
    ).rejects.toThrow();
  });

  it("should require rent to be a positive number", async () => {
    const user = await User.create({
      username: "rent_validator_nora",
      email: "nora.validator@example.net",
      profileImage: "https://cdn.example.com/nora-profile.jpg",
    });

    await expect(
      Accommodation.create({
        address: "Nordic Street 88",
        city: "Malmö",
        country: "Sweden",
        postalCode: "21145",
        rent: -3500,
        rooms: 3,
        userId: user._id,
      })
    ).rejects.toThrow();
  });

  it("should require rooms to be a positive number", async () => {
    const user = await User.create({
      username: "rooms_validator_yousef",
      email: "yousef.rooms@validator.org",
      profileImage: "https://images.example.com/yousef-avatar.png",
    });

    await expect(
      Accommodation.create({
        address: "Uppsala Boulevard 22",
        city: "Uppsala",
        country: "Sweden",
        postalCode: "75235",
        rent: 9800,
        rooms: 0,
        userId: user._id,
      })
    ).rejects.toThrow();
  });

  it("should reference a valid userId", async () => {
    await expect(
      Accommodation.create({
        address: "Västeråsgatan 15",
        city: "Västerås",
        country: "Sweden",
        postalCode: "72131",
        rent: 11000,
        rooms: 2,
        userId: "not-a-valid-objectid-format", // invalid ObjectId
      })
    ).rejects.toThrow();
  });
});

describe("Accommodation Cascade Delete", () => {
  it("should delete accommodations when user is deleted", async () => {
    const user = await User.create({
      username: "cascade_delete_owner_sarah",
      email: "sarah.cascade@test-example.com",
      profileImage: "https://cdn.example.com/sarah-profile.webp",
    });

    await Accommodation.create({
      address: "Gamla Stan 12, lägenhet 5",
      city: "Stockholm",
      country: "Sweden",
      postalCode: "11129",
      rent: 18500,
      rooms: 3,
      userId: user._id,
    });

    await Accommodation.create({
      address: "Östermalmvägen 78, lägenhet 12",
      city: "Stockholm",
      country: "Sweden",
      postalCode: "11456",
      rent: 22500,
      rooms: 5,
      userId: user._id,
    });

    // Delete user → should trigger cascade delete
    await User.findByIdAndDelete(user._id);

    const remaining = await Accommodation.find({ userId: user._id });
    expect(remaining).toHaveLength(0);
  });
});
