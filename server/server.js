const { GraphQLServer } = require("graphql-yoga");
const axios = require("axios");

const API_URL = "https://api.rescuegroups.org/http/v2.json";

const orgInfo = (org) => ({
  apikey: process.env.RESCUEGROUPS_API_KEY,
  objectType: "orgs",
  objectAction: "publicView",
  values: [
    {
      orgID: org,
    },
  ],
  fields: [
    "orgID",
    "orgLocation",
    "orgName",
    "orgAddress",
    "orgCity",
    "orgState",
    "orgPostalcode",
    "orgPlus4",
    "orgCountry",
    "orgPhone",
    "orgFax",
    "orgEmail",
    "orgWebsiteUrl",
    "orgFacebookUrl",
    "orgAdoptionUrl",
    "orgDonationUrl",
    "orgSponsorshipUrl",
    "orgServeAreas",
    "orgAdoptionProcess",
    "orgAbout",
    "orgServices",
    "orgMeetPets",
    "orgType",
    "orgLocationDistance",
    "orgCommonapplicationAccept",
  ],
});

const searchByLocation = (location, limit = 10) => ({
  apikey: process.env.RESCUEGROUPS_API_KEY,
  objectType: "animals",
  objectAction: "publicSearch",
  search: {
    resultStart: 0,
    resultLimit: limit,
    resultSort: "animalAvailableDate",
    resultOrder: "desc",
    filters: [
      {
        fieldName: "animalSpecies",
        operation: "equals",
        criteria: "Dog",
      },
      {
        fieldName: "animalStatus",
        operation: "equals",
        criteria: "Available",
      },
      {
        fieldName: "animalLocationDistance",
        operation: "radius",
        criteria: 50,
      },
      {
        fieldName: "animalLocation",
        operation: "equals",
        criteria: location,
      },
    ],
    filterProcessing: 1,
    fields: [
      "animalID",
      "animalOrgID",
      "animalAdoptedDate",
      "animalAdoptionFee",
      "animalAgeString",
      "animalAvailableDate",
      "animalBreed",
      "animalCoatLength",
      "animalColor",
      "animalColorDetails",
      "animalDescription",
      "animalDescriptionPlain",
      "animalEnergyLevel",
      "animalGeneralAge",
      "animalGeneralSizePotential",
      "animalName",
      "animalThumbnailUrl",
      "locationAddress",
      "locationCity",
      "locationCountry",
      "locationUrl",
      "locationName",
      "locationPhone",
      "locationState",
      "locationPostalcode",
      "animalPictures",
      "animalVideos",
      "animalVideoUrls",
    ],
  },
});

const typeDefs = `
type AnimalOrganization {
  orgID: String
  orgLocation: String
  orgName: String
  orgAddress: String
  orgCity: String
  orgState: String
  orgPostalcode: String
  orgPlus4: String
  orgCountry: String
  orgPhone: String
  orgFax: String
  orgEmail: String
  orgWebsiteUrl: String
  orgFacebookUrl: String
  orgAdoptionUrl: String
  orgDonationUrl: String
  orgSponsorshipUrl: String
  orgServeAreas: String
  orgAdoptionProcess: String
  orgAbout: String
  orgServices: String
  orgMeetPets: String
  orgType: String
  orgLocationDistance: String
  orgCommonapplicationAccept: String
}

type ImageDetail {
  type: String
  fileSize: String
  resolutionX: String
  resolutionY: String
  url: String
}

type Image {
  urlSecureFullsize: String
  urlSecureThumbnail: String
  original: ImageDetail
  large: ImageDetail
  small: ImageDetail
}

type Animal {
  animalID: String
  animalOrgID: String
  animalOrg: AnimalOrganization
  animalAdoptedDate: String
  animalAdoptionFee: String
  animalAgeString: String
  animalAvailableDate: String
  animalBreed: String
  animalCoatLength: String
  animalColor: String
  animalColorDetails: String
  animalDescription: String
  animalDescriptionPlain: String
  animalEnergyLevel: String
  animalGeneralAge: String
  animalGeneralSizePotential: String
  animalName: String
  animalThumbnailUrl: String
  locationAddress: String
  locationCity: String
  locationCountry: String
  locationUrl: String
  locationName: String
  locationPhone: String
  locationState: String
  locationPostalcode: String
  animalPictures: [Image]
}

type Query {
  search(location: Int!, limit: Int): [Animal]
}
`;

const resolvers = {
  Animal: {
    animalOrg: (root) =>
      axios
        .post(API_URL, orgInfo(root.animalOrgID))
        .then((resp) => resp.data.data[0]),
  },
  Query: {
    search: (_, { location, limit }) =>
      axios
        .post(API_URL, searchByLocation(location, limit || 10))
        .then((resp) => Array.from(Object.values(resp.data.data))),
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on http://localhost:4000"));
