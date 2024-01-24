export type League = {
    league: {
        id: number;
        name: string;
        type: string;
        logo: string;
    };
    country: {
        name: string;
        code: string;
        flag: string;
    };
    seasons: {
        year: number;
        start: string;
        end: string;
        current: boolean;
        coverage: {
            fixtures: {
                events: boolean;
                lineups: boolean;
                statistics_fixtures: boolean;
                statistics_players: boolean;
            };
            standings: boolean;
            players: boolean;
            top_scorers: boolean;
            top_assists: boolean;
            top_cards: boolean;
            injuries: boolean;
            predictions: boolean;
            odds: boolean;
        };
    }[];
};

export type Fixture = {
    fixture: {
        id: number;
        referee: string;
        timezone: string;
        date: string;
        timestamp: number;
        periods: {
            first: number;
            second: number;
        };
        venue: {
            id: null | number;
            name: string;
            city: string;
        };
        status: {
            long: string;
            short: string;
            elapsed: number;
        };
    };
    league: {
        id: number;
        name: string;
        country: string;
        logo: string;
        flag: string;
        season: number;
        round: string;
    };
    teams: {
        home: {
            id: number;
            name: string;
            logo: string;
            winner: null | string;
        };
        away: {
            id: number;
            name: string;
            logo: string;
            winner: null | string;
        };
    };
    goals: {
        home: number;
        away: number;
    };
    score: {
        halftime: {
            home: number;
            away: number;
        };
        fulltime: {
            home: number;
            away: number;
        };
        extratime: {
            home: null | number;
            away: null | number;
        };
        penalty: {
            home: null | number;
            away: null | number;
        };
    };
};

export type SportsApiResponse = {
    get: string;
    parameters: {
        league?: string;
        season?: string;
        last?: string;
        id?: string;
    };
    errors: any[];
    results: number;
    paging: {
        current: number;
        total: number;
    };
    response: Fixture[] | League[];
};
