using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using S24.CompetitionApp.ClientService.Base;
using S24.CompetitionApp.ClientService.ScmService;

namespace S24.CompetitionApp.ClientService
{
    public class ScmServiceAdapter : ServiceAdapterBase<ISCMService2Channel>, IScmServiceAdapter
    {
        private readonly int _cacheDurationMinutes;
        private readonly string _userName;
        private readonly string _password;

        public ScmServiceAdapter(string endpointName, int cacheDurationMinutes, string userName, string password)
        : base(endpointName,  userName, password)
        {
            _cacheDurationMinutes = cacheDurationMinutes;
            _userName = userName;
            _password = password;
        }

        public List<string> GetUsersInSharePointGroup(string groupname, bool disableCache)
        {
            var cacheKey = $"GetUsersInSharePointGroup({groupname})";
            if (!disableCache)
            {
                var cached = GetFromCache<List<string>>(cacheKey);
                if (cached?.Any() != null)
                {
                    return cached;
                }
            }

            var result = Client.GetUsersInSharePointGroup(groupname);

            if (!disableCache)
                PutInCache(cacheKey, result);

            return result;
        }

        #region Admin get methods
        public CompetitionSet[] GetAllCompetitions()
        {
            return Client.GetAllCompetitions().ToArray();
        }

        public CompetitionSet GetCompetitionById(int id)
        {
            return Client.GetCompetitionById(id);
        }

        public PVDealerSet[] GetAllDealers()
        {
            return Client.GetAllDealers().ToArray();
        }

        public PVDealerSet GetDealerById(string id)
        {
            return Client.GetDealerById(id);
        }

        public PVProductAgreementSet[] GetAllAgreements()
        {
            return Client.GetAllAgreements().ToArray();
        }

        public SantanderRegionSet[] GetAllSantanderRegions()
        {
            return Client.GetAllSantanderRegions().ToArray();
        }

        public SantanderDistrictSet[] GetAllSantanderDistricts()
        {
            return Client.GetAllSantanderDistricts().ToArray();
        }

        public PVKeyAccountManagerSet[] GetAllKeyAccountManagers()
        {
            return Client.GetAllKeyAccountManagers().ToArray();
        }

        public PVDealerGroupSet[] GetAllDealerGroups()
        {
            return Client.GetAllDealerGroups().ToArray();
        }

        public PVObjectMakeSet[] GetAllObjectMakes()
        {
            return Client.GetAllObjectMakes().ToArray();
        }
        public PVObjectMakeSet GetObjectMakeById(string id)
        {
            return Client.GetObjectMakeById(id);
        }

        public PVObjectStateSet[] GetAllObjectStates()
        {
            return Client.GetAllObjectStates().ToArray();
        }
        #endregion

        #region Admin create, update and delete methods
        public int CreateCompetition(CompetitionSet competition)
        {
            return Client.CreateCompetition(competition);
        }

        public void UpdateCompetition(CompetitionSet competition)
        {
            Client.UpdateCompetition(competition);
        }

        public void DeleteCompetition(int id)
        {
            Client.DeleteCompetiton(id);
        }

        public void UpdateCacheForCompetition(int id)
        {
            Client.UpdateCacheForCompetition(id);
        }

        public void UpdateDealersForCompetition(int competitionId, string[] dealerIds)
        {

            Client.UpdateDealersForCompetition(competitionId, dealerIds.ToList());
        }

        public void UpdateDealerOverridesForCompetition(int competitionId, string[] dealerIds)
        {
            Client.UpdateDealerOverridesForCompetition(competitionId, dealerIds.ToList());
        }

        public void UpdateSalespersonsForCompetition(int competitionId, string[] salespersonIds)
        {
            Client.UpdateSalespersonsForCompetition(competitionId, salespersonIds.ToList());
        }

        public void UpdateSalespersonPointCorrectionsForCompetition(int competitionId, SalespersonPointCorrectionSet[] salespersonPointCorrections)
        {
            Client.UpdateSalespersonPointCorrectionsForCompetition(competitionId, salespersonPointCorrections.ToList());
        }

        public void UpdateAgreementsForCompetition(int competitionId, string[] agreementIds)
        {
            Client.UpdateAgreementsForCompetition(competitionId, agreementIds.ToList());
        }

        public void UpdateRegionsForCompetition(int competitionId, string[] regionIds)
        {
            Client.UpdateSantanderRegionsForCompetition(competitionId, regionIds.ToList());
        }

        public void UpdateSantanderDistrictsForCompetition(int competitionId, string[] departmentIds)
        {
            Client.UpdateSantanderDistrictsForCompetition(competitionId, departmentIds.ToList());
        }

        public void UpdateKeyAccountManagersForCompetition(int competitionId, string[] keyAccountManagerIds)
        {
            Client.UpdateKeyAccountManagersForCompetition(competitionId, keyAccountManagerIds.ToList());
        }

        public void UpdateDealerGroupsForCompetition(int competitionId, string[] dealerGroupIds)
        {
            Client.UpdateDealerGroupsForCompetition(competitionId, dealerGroupIds.ToList());
        }

        public void UpdateObjectMakesForCompetition(int competitionId, string[] objectMakeIds)
        {
            Client.UpdateObjectMakesForCompetition(competitionId, objectMakeIds.ToList());
        }

        public void UpdateObjectModelsForCompetition(int competitionId, string[] objectModelIds)
        {
            Client.UpdateObjectModelsForCompetition(competitionId, objectModelIds.ToList());
        }

        public void UpdateObjectStatesForCompetition(int competitionId, string[] objectStateIds)
        {
            Client.UpdateObjectStatesForCompetition(competitionId, objectStateIds.ToList());
        }
        #endregion

        #region Competition result methods
        public CompetitionSet[] GetCompetitionsForSalesperson(string userCode, bool disableCache)
        {
            var cacheKey = $"GetCompetitionsForSalesperson({userCode})";

            if (!disableCache)
            {
                var cached = GetFromCache<CompetitionSet[]>(cacheKey);
                if (cached != null)
                    return cached;
            }

            var result = Client.GetCompetitionsForSalesperson(userCode).ToArray();

            if (!disableCache)
                PutInCache(cacheKey, result);

            return result;
        }

        public CompetitionRanking[] GetRankingsForCompetition(int competitionId, int rankFrom, int rankTo, bool disableCache)
        {
            var cacheKey = $"GetRankingsForCompetition({competitionId},{rankFrom},{rankTo})";
            if (!disableCache)
            {
                var cached = GetFromCache<CompetitionRanking[]>(cacheKey);
                if (cached != null)
                    return cached;
            }

            var result = Client.GetRankingsForCompetition(competitionId, rankFrom, rankTo).ToArray();

            if (!disableCache)
                PutInCache(cacheKey, result);

            return result;
        }

        public CompetitionRanking GetSalespersonRankingForCompetition(int competitionId, string userCode, bool disableCache)
        {
            var cacheKey = $"GetSalespersonRankingForCompetition({competitionId},{userCode})";
            if (!disableCache)
            {
                var cached = GetFromCache<CompetitionRanking>(cacheKey);
                if (cached != null)
                    return cached;
            }

            var result = Client.GetSalespersonRankingForCompetition(competitionId, userCode);

            if (!disableCache)
                PutInCache(cacheKey, result);

            return result;
        }
        #endregion

        private T GetFromCache<T>(string cacheKey) where T : class
        {
            var cacheObject = MemoryCache.Default[cacheKey];
            return cacheObject as T;
        }

        private void PutInCache(string cacheKey, object obj)
        {
            MemoryCache.Default.Add(cacheKey, obj, DateTime.Now.AddMinutes(_cacheDurationMinutes));
        }

        public byte[] GetPicture(string pictureName)
        {
            return Client.GetPictureByName(pictureName);
        }

        public List<int> GetFollowersForSalesPerson(int salesPersonId)
        {
            return Client.GetFollowersForSalesPerson(salesPersonId);
        }

        public void AddFollower(int salesPersonId, int salesPersonToFollowId)
        {
            Client.AddFollower(salesPersonId, salesPersonToFollowId);
        }

        public void RemoveFollower(int salesPersonId, int salesPersonToFollowId)
        {
            Client.DeleteFollower(salesPersonId, salesPersonToFollowId);
        }

    }
}