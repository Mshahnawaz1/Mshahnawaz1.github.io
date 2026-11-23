export type ContribState = 'merged' | 'open' | 'closed';

export interface Contribution {
  title: string;
  repo: string;
  url: string;
  state: ContribState;
  kind: 'PR' | 'Issue';
}

export const contributionsUrl =
  'https://github.com/metabrainz/listenbrainz-server/pulls?q=is%3Apr+state%3Aclosed+author%3AMshahnawaz1';

export const contributions: Contribution[] = [
  { title: 'FIX:LB-1793 Persistence volume', repo: 'metabrainz/listenbrainz-server', url: 'https://github.com/metabrainz/listenbrainz-server/pull/3271', state: 'merged', kind: 'PR' },
  { title: 'LB-1657: Moved submitting-data page to setting', repo: 'metabrainz/listenbrainz-server', url: 'https://github.com/metabrainz/listenbrainz-server/pull/3230', state: 'merged', kind: 'PR' },
  { title: 'LB-1760: Update broken link in Music Services page', repo: 'metabrainz/listenbrainz-server', url: 'https://github.com/metabrainz/listenbrainz-server/pull/3219', state: 'merged', kind: 'PR' },
  { title: '[LFX] Fix Critical Issues in Government Single-Task Learning Benchmark Example', repo: 'kubeedge/ianvs', url: 'https://github.com/kubeedge/ianvs/issues/353', state: 'open', kind: 'Issue' },
  { title: 'LB-1761: Save Fresh Releases filters in browser storage', repo: 'metabrainz/listenbrainz-server', url: 'https://github.com/metabrainz/listenbrainz-server/pull/3281', state: 'closed', kind: 'PR' },
];
