using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web.Http;
using NLog;
using S24.CompetitionApp.ClientService;
using S24.CompetitionApp.ClientService.ScmService;
using S24.CompetitionApp.HttpFilters;
using static S24.CompetitionApp.Utilities.ValidationHelper;

namespace S24.CompetitionApp.Controllers
{
    [RoutePrefix("api/competition")]
    public class CompetitionController : ApiController
    {

        private readonly IScmServiceAdapter _scmServiceAdapter;
        private static readonly ILogger Logger = LogManager.GetLogger("CompetitionController");

        public CompetitionController(IScmServiceAdapter scmServiceAdapter)
        {
            _scmServiceAdapter = scmServiceAdapter;
        }

        [AuthorizeScm]
        [HttpPut]
        public string CreateCompetition(CompetitionSet competition)
        {
            try
            {
                Validate(competition);

                return ConfigureCompetition(competition);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                return ex.Message;
            }
        }

        [AuthorizeScm]
        [HttpPut]
        public string UpdateCompetition(CompetitionSet competition)
        {
            try
            {
                Validate(competition);

                return ConfigureCompetition(competition);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                return ex.Message;
            }
        }

        private string ConfigureCompetition(CompetitionSet competition)
        {
            var id = competition.Id == 0 ? "" : Convert.ToString(competition.Id);

            //Copy
            var tempPvDealerGroupSet = competition.PVDealerGroupSet.Count > 0 ? competition.PVDealerGroupSet : new List<PVDealerGroupSet>();
            var tempPvDealerOverrideSet = competition.PVDealerOverrideSet.Count > 0 ? competition.PVDealerOverrideSet : new List<PVDealerSet>();
            var tempPvDealerSet = competition.PVDealerSet.Count > 0 ? competition.PVDealerSet : new List<PVDealerSet>();
            var tempPvKeyAccountManagerSet = competition.PVKeyAccountManagerSet.Count > 0 ? competition.PVKeyAccountManagerSet : new List<PVKeyAccountManagerSet>();
            var tempPvObjectMakeSet = competition.PVObjectMakeSet.Count > 0 ? competition.PVObjectMakeSet : new List<PVObjectMakeSet>();
            var tempPvObjectModelSet = competition.PVObjectModelSet.Count > 0 ? competition.PVObjectModelSet : new List<PVObjectModelSet>();
            var tempPvObjectStateSet = competition.PVObjectStateSet.Count > 0 ? competition.PVObjectStateSet : new List<PVObjectStateSet>();
            var tempPvProductAgreementSet = competition.PVProductAgreementSet.Count > 0 ? competition.PVProductAgreementSet : new List<PVProductAgreementSet>();
            var tempPvSalespersonDealerSet = competition.PVSalespersonDealerSet.Count > 0 ? competition.PVSalespersonDealerSet : new List<PVSalespersonDealerSet>();
            var tempSalespersonPointCorrectionSet = competition.SalespersonPointCorrectionSet.Count > 0 ? competition.SalespersonPointCorrectionSet : new List<SalespersonPointCorrectionSet>();
            var tempSantanderDistrictSet = competition.SantanderDistrictSet.Count > 0 ? competition.SantanderDistrictSet : new List<SantanderDistrictSet>();
            var tempSantanderRegionSet = competition.SantanderRegionSet.Count > 0 ? competition.SantanderRegionSet : new List<SantanderRegionSet>();

            //Clean
            competition.PVDealerGroupSet = new List<PVDealerGroupSet>();
            competition.PVDealerOverrideSet = new List<PVDealerSet>();
            competition.PVDealerSet = new List<PVDealerSet>();
            competition.PVKeyAccountManagerSet = new List<PVKeyAccountManagerSet>();
            competition.PVObjectMakeSet = new List<PVObjectMakeSet>();
            competition.PVObjectModelSet = new List<PVObjectModelSet>();
            competition.PVObjectStateSet = new List<PVObjectStateSet>();
            competition.PVProductAgreementSet = new List<PVProductAgreementSet>();
            competition.PVSalespersonDealerSet = new List<PVSalespersonDealerSet>();
            competition.SalespersonPointCorrectionSet = new List<SalespersonPointCorrectionSet>();
            competition.SantanderDistrictSet = new List<SantanderDistrictSet>();
            competition.SantanderRegionSet = new List<SantanderRegionSet>();

            if (string.IsNullOrEmpty(id))
            {
                //Create
                id = _scmServiceAdapter.CreateCompetition(competition).ToString();
            }
            else
            {
                //Update
                _scmServiceAdapter.UpdateCompetition(competition);
            }

            var intId = Convert.ToInt32(id);
            string[] ids;

            //Update collections
            ids = tempPvProductAgreementSet.Select(i => i.PVProductAgreementId).ToArray();
            _scmServiceAdapter.UpdateAgreementsForCompetition(intId, ids);

            ids = tempSantanderRegionSet.Select(i => i.SantanderRegionID.ToString()).ToArray();
            _scmServiceAdapter.UpdateRegionsForCompetition(intId, ids);

            ids = tempSantanderDistrictSet.Select(i => i.SantanderDistrictID.ToString()).ToArray();
            _scmServiceAdapter.UpdateSantanderDistrictsForCompetition(intId, ids);

            ids = tempPvKeyAccountManagerSet.Select(i => i.PVKeyAccountManagerId).ToArray();
            _scmServiceAdapter.UpdateKeyAccountManagersForCompetition(intId, ids);

            ids = tempPvDealerSet.Select(i => i.PVDealerId).ToArray();
            _scmServiceAdapter.UpdateDealersForCompetition(intId, ids);

            ids = tempPvDealerOverrideSet.Select(i => i.PVDealerId).ToArray();
            _scmServiceAdapter.UpdateDealerOverridesForCompetition(intId, ids);

            ids = tempPvSalespersonDealerSet.Select(i => i.PVSalespersonDealerId).ToArray();
            _scmServiceAdapter.UpdateSalespersonsForCompetition(intId, ids);

            ids = tempPvDealerGroupSet.Select(i => i.PVDealerGroupId).ToArray();
            _scmServiceAdapter.UpdateDealerGroupsForCompetition(intId, ids);

            ids = tempPvObjectMakeSet.Select(i => i.PVObjectMakeId).ToArray();
            _scmServiceAdapter.UpdateObjectMakesForCompetition(intId, ids);

            ids = tempPvObjectModelSet.Select(i => i.PVObjectModelId).ToArray();
            _scmServiceAdapter.UpdateObjectModelsForCompetition(intId, ids);

            ids = tempPvObjectStateSet.Select(i => i.Id).ToArray();
            _scmServiceAdapter.UpdateObjectStatesForCompetition(intId, ids);

            _scmServiceAdapter.UpdateSalespersonPointCorrectionsForCompetition(intId,
                                                    tempSalespersonPointCorrectionSet.ToArray());

            _scmServiceAdapter.UpdateCacheForCompetition(intId);

            return id;
        }

        [AuthorizeKamOrScm]
        [HttpGet]
        public List<CompetitionSet> GetCompetitions()
        {
            try
            {
                //Get competitions
                var competitionSet = _scmServiceAdapter.GetAllCompetitions();

                //Convert into generic list
                return competitionSet.OrderByDescending(c => c.Id).ToList();
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetCompetitions() - Error:");
                return null;
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public CompetitionSet GetCompetitionById(string id)
        {
            try
            {
                return _scmServiceAdapter.GetCompetitionById(Convert.ToInt32(id));
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetCompetitionById() - Error:");
                return null;
            }
        }

        [HttpGet]
        public List<CompetitionSet> GetCompetitionsForSalesperson(string id)
        {
            try
            {
                return _scmServiceAdapter.GetCompetitionsForSalesperson(id, false).ToList();
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetCompetitionsForSalesperson() - Error:");
                return null;
            }
        }

        [AuthorizeScm]
        [HttpDelete]
        public string DeleteCompetition(string id)
        {
            try
            {
                //Delete competition
                _scmServiceAdapter.DeleteCompetition(Convert.ToInt32(id));
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - DeleteCompetition() - Error:");
                return "false";
            }
            return "true";
        }

        [AllowAnonymous]
        [HttpGet]
        public string GetImage(string id)
        {
            var imageData = _scmServiceAdapter.GetPicture(id);

            Image image;
            using (var ms = new MemoryStream(imageData))
            {
                image = Image.FromStream(ms);
            }

            var imageFormat = "";
            if (ImageFormat.Jpeg.Equals(image.RawFormat))
            {
                imageFormat = "image/jpg";
            }
            else if (ImageFormat.Png.Equals(image.RawFormat))
            {
                imageFormat = "image/png";
            }
            else if (ImageFormat.Gif.Equals(image.RawFormat))
            {
                imageFormat = "image/gif";
            }

            var base64String = $"data:{imageFormat};base64,{Convert.ToBase64String(imageData)}";

            return base64String;
        }

        [AuthorizeScm]
        [HttpGet]
        public List<PVProductAgreementSet> GetAllAgreements()
        {
            try
            {
                return _scmServiceAdapter.GetAllAgreements().ToList();
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetAllAgreements() - Error:");
                return null;
            }
        }

        [AuthorizeScm]
        [HttpGet]
        public List<PVDealerSet> GetAllDealers()
        {
            try
            {
                return _scmServiceAdapter.GetAllDealers().ToList();
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetAllDealers() - Error:");
                return null;
            }
        }

        [HttpGet]
        public PVDealerSet GetDealerById(string id)
        {
            try
            {
                return _scmServiceAdapter.GetDealerById(id);
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetDealerById() - Error:");
                return null;
            }
        }

        [HttpGet]
        public List<PVSalespersonDealerSet> GetSalesPersons(string id)
        {
            var salesPersons = new List<PVSalespersonDealerSet>();

            try
            {
                var dealer = _scmServiceAdapter.GetDealerById(id);

                if (dealer != null)
                {
                    salesPersons = dealer.PVSalespersonDealerSet;
                }
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetSalesPersons() - Error:");
                return null;
            }

            return salesPersons;
        }

        [AuthorizeScm]
        [HttpGet]
        public List<SantanderRegionSet> GetAllRegions()
        {
            try
            {
                return _scmServiceAdapter.GetAllSantanderRegions().ToList();
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetAllRegions() - Error:");
                return null;
            }
        }

        [AuthorizeScm]
        [HttpGet]
        public List<SantanderDistrictSet> GetAllDistricts()
        {
            try
            {
                return _scmServiceAdapter.GetAllSantanderDistricts().ToList();
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetAllDistricts() - Error:");
                return null;
            }
        }

        [AuthorizeScm]
        [HttpGet]
        public List<PVKeyAccountManagerSet> GetAllKeyAccountManagers()
        {
            try
            {
                return _scmServiceAdapter.GetAllKeyAccountManagers().ToList();
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetAllKeyAccountManagers() - Error:");
                return null;
            }
        }

        [AuthorizeScm]
        [HttpGet]
        public List<PVDealerGroupSet> GetAllDealerGroups()
        {
            try
            {
                return _scmServiceAdapter.GetAllDealerGroups().ToList();
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetAllDealerGroups() - Error:");
                return null;
            }
        }

        [AuthorizeScm]
        [HttpGet]
        public List<PVObjectMakeSet> GetAllObjectMake()
        {
            try
            {
                return _scmServiceAdapter.GetAllObjectMakes().ToList();
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetAllObjectMake() - Error:");
                return null;
            }
        }

        [AuthorizeScm]
        [HttpGet]
        public PVObjectMakeSet GetObjectMakeById(string id)
        {
            try
            {
                return _scmServiceAdapter.GetObjectMakeById(id);
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetObjectMakeById() - Error:");
                return null;
            }
        }

        [AuthorizeScm]
        [HttpGet]
        public List<PVObjectModelSet> GetObjectModelsByMakeId(string id)
        {
            var objectModels = new List<PVObjectModelSet>();

            try
            {
                var objectMake = _scmServiceAdapter.GetObjectMakeById(id);
                if (objectMake != null)
                {
                    objectModels = objectMake.PVObjectModelSet;
                }
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetObjectModelsByMakeId() - Error:");
                return null;
            }

            return objectModels;
        }

        [AuthorizeScm]
        [HttpGet]
        public List<PVObjectStateSet> GetAllObjectStates()
        {
            try
            {
                return _scmServiceAdapter.GetAllObjectStates().ToList();
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetAllObjectStates() - Error:");
                return null;
            }
        }

        [AuthorizeScm]
        [HttpGet]
        public List<SalespersonPointCorrectionSet> GetSalesPersonPointCorrection(string id)
        {
            var salesPersonPointCorrections = new List<SalespersonPointCorrectionSet>();

            try
            {
                var competition = GetCompetitionById(id);
                if (competition != null)
                {
                    salesPersonPointCorrections = competition.SalespersonPointCorrectionSet;
                }
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetSalesPersonPointCorrection() - Error:");
                return null;
            }

            return salesPersonPointCorrections;
        }

        [AuthorizeScm]
        [HttpPut]
        public bool UpdateSalesPersonPointCorrection(string id, List<SalespersonPointCorrectionSet> list)
        {
            try
            {
                var competition = GetCompetitionById(id);
                if (competition != null)
                {
                    _scmServiceAdapter.UpdateSalespersonPointCorrectionsForCompetition(Convert.ToInt32(id), list.ToArray());
                }

                return true;
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - UpdateSalesPersonPointCorrection() - Error:");
                return false;
            }
        }

        [HttpGet]
        public List<CompetitionRanking> GetRankingsForCompetition(string id)
        {
            try
            {
                return _scmServiceAdapter.GetRankingsForCompetition(Convert.ToInt32(id), 0, int.MaxValue, true).ToList();
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetRankingsForCompetition() - Error:");
                return null;
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetRankingsForCompetitionWithFollowers/{id}/{salesPersonId}")]
        public Dictionary<string, List<CompetitionRanking>> GetRankingsForCompetitionWithFollowers(string id, int salesPersonId)
        {
            try
            {
                var ranking = _scmServiceAdapter.GetRankingsForCompetition(Convert.ToInt32(id), 0, int.MaxValue, true).ToList();
                var followedSalesPersons = _scmServiceAdapter.GetFollowersForSalesPerson(salesPersonId);

                // Find the following rankings and create a new list
                var followingRankingList = ranking.FindAll(x => followedSalesPersons.Contains(Convert.ToInt32(x.Salesperson_Dealer_Code)));

                // Remove the following rankings from the list
                ranking.RemoveAll(x => followedSalesPersons.Contains(Convert.ToInt32(x.Salesperson_Dealer_Code)));

                return new Dictionary<string, List<CompetitionRanking>>
                {
                    {"rankingListWithoutFollowing", ranking}, {"followingRankingList", followingRankingList}
                };
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetRankingsForCompetitionWithFollowers() - Error:");
                return null;
            }
        }

        [HttpGet]
        public List<int> GetFollowersForSalesPerson(string id)
        {
            try
            {
                return _scmServiceAdapter.GetFollowersForSalesPerson(Convert.ToInt32(id));
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetFollowersForSalesPerson() - Error:");
                return null;
            }
        }

        [AllowAnonymous]
        [HttpDelete]
        [Route("RemoveSalespersonAsFollower/{id}/{salesPersonFollowId}")]
        public bool RemoveSalespersonAsFollower(string id, string salesPersonFollowId)
        {
            try
            {
                _scmServiceAdapter.RemoveFollower(Convert.ToInt32(id), Convert.ToInt32(salesPersonFollowId));
                return true;
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - RemoveSalespersonAsFollower() - Error:");
                return false;
            }
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("AddFollowerForSalesPerson/{id}/{salesPersonFollowId}")]
        public bool AddFollowerForSalesPerson(string id, string salesPersonFollowId)
        {
            try
            {
                _scmServiceAdapter.AddFollower(Convert.ToInt32(id), Convert.ToInt32(salesPersonFollowId));
                return true;
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - AddFollowerForSalesPerson() - Error:");
                return false;
            }
        }

        [HttpGet]
        [Route("GetRankingsForCompetitionRange/{id}/{topValue}")]
        public List<CompetitionRanking> GetRankingsForCompetitionRange(string id, string topValue)
        {
            try
            {
                return _scmServiceAdapter.GetRankingsForCompetition(Convert.ToInt32(id), 0, Convert.ToInt32(topValue), true).ToList();
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetRankingsForCompetitionRange() - Error:");
                return null;
            }
        }

        [HttpGet]
        [Route("GetSalespersonRankingForCompetition/{competitionId}/{salesPersonId}")]
        public CompetitionRanking GetSalespersonRankingForCompetition(string competitionId, string salesPersonId)
        {
            try
            {
                return _scmServiceAdapter.GetSalespersonRankingForCompetition(Convert.ToInt32(competitionId), salesPersonId, true);
            }
            catch (Exception e)
            {
                Logger.Error(e, "CompetitionModuleApp - GetSalespersonRankingForCompetition() - Error:");
                return null;
            }
        }

        private static void Validate(CompetitionSet competition)
        {
            if (!ValidateSpecialCharacters(competition.Name))
            {
                throw new ArgumentException("The Name field contains invalid characters");
            }
        }
    }
}
