using System.Collections.Generic;
using S24.CompetitionApp.ClientService.ScmService;

namespace S24.CompetitionApp.Models
{
    public class CompetitionSummaryViewModel
    {
        public bool CompetitionsFound { get; set; }

        public string FirstCompetitionTitle { get; set; }

        public int FirstCompetitionId { get; set; }

        public string FirstCompetitionRanking { get; set; }

        public string FirstCompetitionPoints { get; set; }

        public CompetitionRanking[] FirstCompetitionRankingsRankList { get; set; }

        public List<CompetitionSet> OtherCompetitions { get; set; }

        public string SalesPersonUserCode { get; set; }

    }
}