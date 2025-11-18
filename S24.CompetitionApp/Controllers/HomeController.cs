using System;
using System.Linq;
using System.Web.Mvc;
using NLog;
using S24.CompetitionApp.ClientService;
using S24.CompetitionApp.Models;

namespace S24.CompetitionApp.Controllers
{
    
    public class HomeController : Controller
    {
        private readonly IScmServiceAdapter _scmService2Adapter;
        private static readonly ILogger Logger = LogManager.GetLogger("HomeController");

        public HomeController(IScmServiceAdapter scmService2Adapter)
        {
            _scmService2Adapter = scmService2Adapter;
        }
        
        [Route("~/AllCompetitionsKAM")]
        public ActionResult AllCompetitionsKAM()
        {
            return View();
        }

        [Route("~/AllCompetitions")]
        public ActionResult AllCompetitions()
        {
            return View();
        }
        
        [Route("~/CompetitionDetailsAdmin")]
        public ActionResult CompetitionDetailsAdmin()
        {
           return View();
        }

        [Route("~/CompetitionDetails")]
        public ActionResult CompetitionDetails()
        {
            return View();
        }

        
        [Route("~/Competition")]
        public ActionResult Competition()
        {
            return View();
        }

        // TODO: Get salesperson from secure cookie
        [Route("~/CompetitionSummary")]
        public ActionResult CompetitionSummary(string salespersonId)
        {
            try
            {
                var competitionsForSalesPerson = _scmService2Adapter.GetCompetitionsForSalesperson(salespersonId, false).ToList();

                if (competitionsForSalesPerson.Count == 0)
                {
                    return View(new CompetitionSummaryViewModel { CompetitionsFound = false });
                }

                var firstCompetition = competitionsForSalesPerson[0];
                var remainingCompetitions = competitionsForSalesPerson.GetRange(1, competitionsForSalesPerson.Count - 1);
                var ranking = _scmService2Adapter.GetSalespersonRankingForCompetition(firstCompetition.Id, salespersonId, true);

                var competitionSummaryViewModel = new CompetitionSummaryViewModel
                {
                    CompetitionsFound = true,
                    FirstCompetitionPoints = ranking?.Points.ToString(),
                    FirstCompetitionRanking = ranking?.CurrentRank.ToString(),
                    FirstCompetitionId = firstCompetition.Id,
                    FirstCompetitionTitle = firstCompetition.DisplayName,
                    SalesPersonUserCode = salespersonId,
                    OtherCompetitions = remainingCompetitions,
                    FirstCompetitionRankingsRankList = _scmService2Adapter.GetRankingsForCompetition(
                        firstCompetition.Id, 0,
                        firstCompetition.DisplayNumberOfHighlighedSellers, true)
                };

                return View(competitionSummaryViewModel);
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - CompetitionSummary() - Error: Could not generate CompetitionSummary");
                return View(new CompetitionSummaryViewModel { CompetitionsFound = false });
            }

        }

    }
}