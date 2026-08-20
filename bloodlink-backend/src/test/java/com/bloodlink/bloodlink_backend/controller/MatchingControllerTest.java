package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.repo.BloodRequestRepository;
import com.bloodlink.bloodlink_backend.service.MatchingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class MatchingControllerTest {

    @Mock
    private MatchingService matchingService;

    @Mock
    private BloodRequestRepository bloodRequestRepository;

    @InjectMocks
    private MatchingController matchingController;

    private MockMvc mockMvc;

    private UUID requestId;

    private BloodRequest bloodRequest;

    @BeforeEach
    void setUp() {

        mockMvc = MockMvcBuilders
                .standaloneSetup(matchingController)
                .build();

        requestId = UUID.randomUUID();

        bloodRequest = new BloodRequest();
    }


    // =====================================================
    // TEST 1
    // GET eligible donors - success
    // =====================================================

    @Test
    void shouldReturnEligibleDonors() throws Exception {

        Donor donor = new Donor();

        when(bloodRequestRepository.findById(requestId))
                .thenReturn(Optional.of(bloodRequest));

        when(matchingService.findEligibleDonors(bloodRequest))
                .thenReturn(List.of(donor));


        mockMvc.perform(
                        get("/api/matching/eligible/{requestId}", requestId)
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));


        verify(
                bloodRequestRepository,
                times(1)
        ).findById(requestId);

        verify(
                matchingService,
                times(1)
        ).findEligibleDonors(bloodRequest);
    }


    // =====================================================
    // TEST 2
    // GET eligible donors - no donors
    // =====================================================

    @Test
    void shouldReturnEmptyListWhenNoEligibleDonors() throws Exception {

        when(bloodRequestRepository.findById(requestId))
                .thenReturn(Optional.of(bloodRequest));

        when(matchingService.findEligibleDonors(bloodRequest))
                .thenReturn(List.of());


        mockMvc.perform(
                        get("/api/matching/eligible/{requestId}", requestId)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));


        verify(
                matchingService,
                times(1)
        ).findEligibleDonors(bloodRequest);
    }


    // =====================================================
    // TEST 3
    // GET eligible donors - request not found
    // =====================================================

    @Test
    void shouldFailWhenBloodRequestDoesNotExist() {

        when(bloodRequestRepository.findById(requestId))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> matchingController.findEligibleDonors(requestId)
        );

        verify(
                matchingService,
                never()
        ).findEligibleDonors(any());
    }


    // =====================================================
    // TEST 4
    // POST rank donors - success
    // =====================================================

    @Test
    void shouldRankDonors() throws Exception {

        when(bloodRequestRepository.findById(requestId))
                .thenReturn(Optional.of(bloodRequest));

        when(matchingService.rankDonors(bloodRequest))
                .thenReturn(List.of());


        mockMvc.perform(
                        post("/api/matching/rank/{requestId}", requestId)
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));


        verify(
                bloodRequestRepository,
                times(1)
        ).findById(requestId);

        verify(
                matchingService,
                times(1)
        ).rankDonors(bloodRequest);
    }


    // =====================================================
    // TEST 5
    // POST rank donors - request not found
    // =====================================================

    @Test
    void shouldFailRankingWhenBloodRequestDoesNotExist() {

        when(bloodRequestRepository.findById(requestId))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> matchingController.rankDonors(requestId)
        );

        verify(
                matchingService,
                never()
        ).rankDonors(any());
    }
}