package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.repo.DonorMatchRepository;
import com.bloodlink.bloodlink_backend.repo.DonorRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.bloodlink.bloodlink_backend.entity.Hospital;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MatchingServiceImpTest {
    @Mock
    private Hospital hospital;

    @Mock
    private DonorRepo donorRepo;

    @Mock
    private DonorMatchRepository donorMatchRepository;

    @Mock
    private BloodRequest bloodRequest;

    @InjectMocks
    private MatchingServiceImp matchingService;


    // =====================================================
    // TEST 1
    // Eligible donor should be returned
    // =====================================================

    @Test
    void shouldReturnEligibleDonor() {

        Donor donor = new Donor();

        donor.setAvailable(true);
        donor.setBloodGroup(BloodGroup.A_POSITIVE);
        donor.setLastDonationDate(
                LocalDate.now().minusDays(100)
        );

        when(bloodRequest.getBloodGroup())
                .thenReturn(BloodGroup.A_POSITIVE);

        when(donorRepo.findByAvailableTrue())
                .thenReturn(List.of(donor));

        List<Donor> result =
                matchingService.findEligibleDonors(bloodRequest);

        assertEquals(1, result.size());
        assertSame(donor, result.get(0));
    }


    // =====================================================
    // TEST 2
    // Donor donated less than 90 days ago
    // =====================================================

    @Test
    void shouldRejectDonorWhoDonatedWithin90Days() {

        Donor donor = new Donor();

        donor.setAvailable(true);
        donor.setBloodGroup(BloodGroup.A_POSITIVE);

        // Donated only 30 days ago
        donor.setLastDonationDate(
                LocalDate.now().minusDays(30)
        );

        when(bloodRequest.getBloodGroup())
                .thenReturn(BloodGroup.A_POSITIVE);

        when(donorRepo.findByAvailableTrue())
                .thenReturn(List.of(donor));

        List<Donor> result =
                matchingService.findEligibleDonors(bloodRequest);

        assertTrue(result.isEmpty());
    }


    // =====================================================
    // TEST 3
    // Incompatible blood group should be rejected
    // =====================================================

    @Test
    void shouldRejectIncompatibleBloodGroup() {

        Donor donor = new Donor();

        donor.setAvailable(true);

        // B+ donor
        donor.setBloodGroup(BloodGroup.B_POSITIVE);

        donor.setLastDonationDate(
                LocalDate.now().minusDays(100)
        );

        // A+ blood request
        when(bloodRequest.getBloodGroup())
                .thenReturn(BloodGroup.A_POSITIVE);

        when(donorRepo.findByAvailableTrue())
                .thenReturn(List.of(donor));

        List<Donor> result =
                matchingService.findEligibleDonors(bloodRequest);

        assertTrue(result.isEmpty());
    }


    // =====================================================
    // TEST 4
    // Donor with no previous donation
    // =====================================================

    @Test
    void shouldAllowDonorWithNoPreviousDonation() {

        Donor donor = new Donor();

        donor.setAvailable(true);
        donor.setBloodGroup(BloodGroup.A_POSITIVE);

        // Never donated before
        donor.setLastDonationDate(null);

        when(bloodRequest.getBloodGroup())
                .thenReturn(BloodGroup.A_POSITIVE);

        when(donorRepo.findByAvailableTrue())
                .thenReturn(List.of(donor));

        List<Donor> result =
                matchingService.findEligibleDonors(bloodRequest);

        assertEquals(1, result.size());
        assertSame(donor, result.get(0));
    }


    // =====================================================
    // TEST 5
    // Only eligible donors should be returned
    // =====================================================

    @Test
    void shouldReturnOnlyEligibleDonors() {

        // -------------------------
        // Eligible donor
        // -------------------------

        Donor eligibleDonor = new Donor();

        eligibleDonor.setAvailable(true);
        eligibleDonor.setBloodGroup(BloodGroup.A_POSITIVE);
        eligibleDonor.setLastDonationDate(
                LocalDate.now().minusDays(100)
        );


        // -------------------------
        // Recent donor
        // -------------------------

        Donor recentDonor = new Donor();

        recentDonor.setAvailable(true);
        recentDonor.setBloodGroup(BloodGroup.A_POSITIVE);
        recentDonor.setLastDonationDate(
                LocalDate.now().minusDays(20)
        );


        // -------------------------
        // Incompatible donor
        // -------------------------

        Donor incompatibleDonor = new Donor();

        incompatibleDonor.setAvailable(true);
        incompatibleDonor.setBloodGroup(BloodGroup.B_POSITIVE);
        incompatibleDonor.setLastDonationDate(
                LocalDate.now().minusDays(100)
        );


        when(bloodRequest.getBloodGroup())
                .thenReturn(BloodGroup.A_POSITIVE);

        when(donorRepo.findByAvailableTrue())
                .thenReturn(
                        List.of(
                                eligibleDonor,
                                recentDonor,
                                incompatibleDonor
                        )
                );


        List<Donor> result =
                matchingService.findEligibleDonors(bloodRequest);


        assertEquals(1, result.size());

        assertSame(
                eligibleDonor,
                result.get(0)
        );
    }


    // =====================================================
    // TEST 6
    // Repository should be called once
    // =====================================================


    @Test
    void shouldFetchAvailableDonorsFromRepository() {

        when(donorRepo.findByAvailableTrue())
                .thenReturn(List.of());

        matchingService.findEligibleDonors(bloodRequest);

        verify(
                donorRepo,
                times(1)
        ).findByAvailableTrue();
    }
    // =====================================================
// TEST 7
// Higher scoring donor should come first
// =====================================================

    @Test
    void shouldRankHigherScoringDonorFirst() {

        Donor highScoreDonor = new Donor();

        highScoreDonor.setAvailable(true);
        highScoreDonor.setBloodGroup(BloodGroup.A_POSITIVE);
        highScoreDonor.setLastDonationDate(
                LocalDate.now().minusDays(100)
        );
        highScoreDonor.setLatitude(26.9124);
        highScoreDonor.setLongitude(75.7873);
        highScoreDonor.setBloodLinkScore(20.0);
        highScoreDonor.setSuccessfulDonations(10);


        Donor lowScoreDonor = new Donor();

        lowScoreDonor.setAvailable(true);
        lowScoreDonor.setBloodGroup(BloodGroup.A_POSITIVE);
        lowScoreDonor.setLastDonationDate(
                LocalDate.now().minusDays(100)
        );
        lowScoreDonor.setLatitude(27.1767);
        lowScoreDonor.setLongitude(78.0081);
        lowScoreDonor.setBloodLinkScore(5.0);
        lowScoreDonor.setSuccessfulDonations(1);


        when(bloodRequest.getBloodGroup())
                .thenReturn(BloodGroup.A_POSITIVE);

        when(bloodRequest.getHospital())
                .thenReturn(hospital);

        when(hospital.getLatitude())
                .thenReturn(26.9124);

        when(hospital.getLongitude())
                .thenReturn(75.7873);

        when(donorRepo.findByAvailableTrue())
                .thenReturn(
                        List.of(
                                lowScoreDonor,
                                highScoreDonor
                        )
                );


        List<DonorMatch> result =
                matchingService.rankDonors(bloodRequest);


        assertEquals(2, result.size());

        assertSame(
                highScoreDonor,
                result.get(0).getDonor()
        );

        assertSame(
                lowScoreDonor,
                result.get(1).getDonor()
        );
    }// =====================================================
// TEST 10
// Should return maximum 10 matches
// =====================================================

    @Test
    void shouldReturnMaximumTenMatches() {

        Donor[] donors = new Donor[12];

        for (int i = 0; i < 12; i++) {

            Donor donor = new Donor();

            donor.setAvailable(true);
            donor.setBloodGroup(BloodGroup.A_POSITIVE);
            donor.setLastDonationDate(
                    LocalDate.now().minusDays(100)
            );

            donor.setLatitude(26.9124);
            donor.setLongitude(75.7873);

            donor.setBloodLinkScore(10.0);
            donor.setSuccessfulDonations(5);

            donors[i] = donor;
        }


        when(bloodRequest.getBloodGroup())
                .thenReturn(BloodGroup.A_POSITIVE);

        when(bloodRequest.getHospital())
                .thenReturn(hospital);

        when(hospital.getLatitude())
                .thenReturn(26.9124);

        when(hospital.getLongitude())
                .thenReturn(75.7873);

        when(donorRepo.findByAvailableTrue())
                .thenReturn(List.of(donors));


        List<DonorMatch> result =
                matchingService.rankDonors(bloodRequest);


        assertEquals(10, result.size());
    }
}