using System.Collections.Generic;
using S24.CompetitionApp.ClientService.ScmService;

namespace S24.CompetitionApp.ClientService
{
    public interface IScmServiceAdapter
    {
        int CreateCompetition(CompetitionSet competition);

        void DeleteCompetition(int id);

        List<string> GetUsersInSharePointGroup(string groupname, bool disableCache);

        PVProductAgreementSet[] GetAllAgreements();

        CompetitionSet[] GetAllCompetitions();

        PVDealerGroupSet[] GetAllDealerGroups();

        PVDealerSet[] GetAllDealers();

        PVKeyAccountManagerSet[] GetAllKeyAccountManagers();

        PVObjectMakeSet[] GetAllObjectMakes();

        PVObjectStateSet[] GetAllObjectStates();

        SantanderDistrictSet[] GetAllSantanderDistricts();

        SantanderRegionSet[] GetAllSantanderRegions();

        CompetitionSet GetCompetitionById(int id);

        CompetitionSet[] GetCompetitionsForSalesperson(string userCode, bool disableCache);

        PVDealerSet GetDealerById(string id);

        PVObjectMakeSet GetObjectMakeById(string id);

        CompetitionRanking[] GetRankingsForCompetition(int competitionId, int rankFrom, int rankTo, bool disableCache);

        CompetitionRanking GetSalespersonRankingForCompetition(int competitionId, string userCode, bool disableCache);

        void UpdateAgreementsForCompetition(int competitionId, string[] agreementIds);

        void UpdateCacheForCompetition(int id);

        void UpdateCompetition(CompetitionSet competition);

        void UpdateDealerGroupsForCompetition(int competitionId, string[] dealerGroupIds);

        void UpdateDealerOverridesForCompetition(int competitionId, string[] dealerIds);

        void UpdateDealersForCompetition(int competitionId, string[] dealerIds);

        void UpdateKeyAccountManagersForCompetition(int competitionId, string[] keyAccountManagerIds);

        void UpdateObjectMakesForCompetition(int competitionId, string[] objectMakeIds);

        void UpdateObjectModelsForCompetition(int competitionId, string[] objectModelIds);

        void UpdateObjectStatesForCompetition(int competitionId, string[] objectStateIds);

        void UpdateRegionsForCompetition(int competitionId, string[] regionIds);

        void UpdateSalespersonPointCorrectionsForCompetition(int competitionId,
            SalespersonPointCorrectionSet[] salespersonPointCorrections);

        void UpdateSalespersonsForCompetition(int competitionId, string[] salespersonIds);

        void UpdateSantanderDistrictsForCompetition(int competitionId, string[] departmentIds);

        byte[] GetPicture(string pictureName);

        List<int> GetFollowersForSalesPerson(int salesPersonId);

        void AddFollower(int salesPersonId, int salesPersonToFollowId);

        void RemoveFollower(int salesPersonId, int salesPersonToFollowId);
    }
}