export const mockUsers = [
  {
    id: "1",
    name: "Anjali Kumar",
    title: "Quiet Contributor",
    location: "Thrissur",
    interests: ["Education", "Environment"],
    isCommunityVisible: true,
    bio: "Supporting local education initiatives and environmental awareness programs in rural areas."
  },
  {
    id: "2",
    name: "Rajesh Menon",
    title: "Community Anchor",
    location: "Kochi",
    interests: ["Health", "Caregiving"],
    isCommunityVisible: true,
    bio: "Working with elderly care facilities and health awareness campaigns."
  },
  {
    id: "3",
    name: "Priya Nair",
    title: "Steady Supporter",
    location: "Calicut",
    interests: ["Education", "Health"],
    isCommunityVisible: true,
    bio: "Dedicated to improving healthcare access in underserved communities."
  },
  {
    id: "4",
    name: "Vineeth Das",
    title: "Quiet Contributor",
    location: "Thrissur",
    interests: ["Environment", "Education"],
    isCommunityVisible: true,
    bio: "Organizing tree planting drives and sustainability workshops."
  },
  {
    id: "5",
    name: "Lakshmi Pillai",
    title: "Community Anchor",
    location: "Kochi",
    interests: ["Caregiving", "Health"],
    isCommunityVisible: true,
    bio: "Providing support to families caring for loved ones with special needs."
  },
  {
    id: "6",
    name: "Arun Krishnan",
    title: "Steady Supporter",
    location: "Calicut",
    interests: ["Education", "Environment"],
    isCommunityVisible: true,
    bio: "Teaching environmental science and leading coastal cleanup initiatives."
  }
];

export function getVisibleUsers() {
  return mockUsers.filter(user => user.isCommunityVisible);
}

export function addUserToCommunity(user) {
  if (user.isCommunityVisible) {
    mockUsers.push(user);
  }
}