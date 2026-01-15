export const titles = {
  Environment: [
    { minPoints: 0, title: 'Nature Lover' },
    { minPoints: 200, title: 'Eco Friend' },
    { minPoints: 500, title: 'Green Advocate' },
    { minPoints: 800, title: 'Eco Warrior' },
    { minPoints: 1200, title: 'Environmental Guardian' },
    { minPoints: 1600, title: 'Planet Protector' },
    { minPoints: 2000, title: 'Sustainability Champion' },
  ],
  Education: [
    { minPoints: 0, title: 'Learner' },
    { minPoints: 200, title: 'Knowledge Seeker' },
    { minPoints: 500, title: 'Education Supporter' },
    { minPoints: 800, title: 'Teaching Assistant' },
    { minPoints: 1200, title: 'Education Champion' },
    { minPoints: 1600, title: 'Mentor' },
    { minPoints: 2000, title: 'Wisdom Guide' },
  ],
  'Social Work': [
    { minPoints: 0, title: 'Helper' },
    { minPoints: 200, title: 'Community Helper' },
    { minPoints: 500, title: 'Social Worker' },
    { minPoints: 800, title: 'Advocate' },
    { minPoints: 1200, title: 'Community Builder' },
    { minPoints: 1600, title: 'Change Maker' },
    { minPoints: 2000, title: 'Social Justice Warrior' },
  ],
  Healthcare: [
    { minPoints: 0, title: 'Caregiver' },
    { minPoints: 200, title: 'Health Supporter' },
    { minPoints: 500, title: 'Medical Assistant' },
    { minPoints: 800, title: 'Healthcare Hero' },
    { minPoints: 1200, title: 'Wellness Champion' },
    { minPoints: 1600, title: 'Healer' },
    { minPoints: 2000, title: 'Life Saver' },
  ],
  'Animal Welfare': [
    { minPoints: 0, title: 'Animal Lover' },
    { minPoints: 200, title: 'Pet Friend' },
    { minPoints: 500, title: 'Animal Advocate' },
    { minPoints: 800, title: 'Wildlife Protector' },
    { minPoints: 1200, title: 'Animal Rights Champion' },
    { minPoints: 1600, title: 'Compassionate Guardian' },
    { minPoints: 2000, title: 'Beast Master' },
  ],
  'Disaster Relief': [
    { minPoints: 0, title: 'Responder' },
    { minPoints: 200, title: 'Relief Worker' },
    { minPoints: 500, title: 'Emergency Helper' },
    { minPoints: 800, title: 'Crisis Manager' },
    { minPoints: 1200, title: 'Disaster Hero' },
    { minPoints: 1600, title: 'Resilience Builder' },
    { minPoints: 2000, title: 'Hope Restorer' },
  ],
};

export function getTitleForTrack(trackName, points) {
  const trackTitles = titles[trackName];
  if (!trackTitles) return 'Contributor';
  
  // Find the highest title the user qualifies for
  for (let i = trackTitles.length - 1; i >= 0; i--) {
    if (points >= trackTitles[i].minPoints) {
      return trackTitles[i].title;
    }
  }
  return trackTitles[0].title;
}

export function getCurrentTitle(tracks) {
  if (!tracks || tracks.length === 0) return 'Newcomer';
  
  // Find the track with the highest points
  const topTrack = tracks.reduce((max, track) => track.points > max.points ? track : max);
  
  return getTitleForTrack(topTrack.name, topTrack.points);
}