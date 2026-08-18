package com.bloodlink.bloodlink_backend.config;

import com.bloodlink.bloodlink_backend.security.CustomUserDetailsService;
import com.bloodlink.bloodlink_backend.security.GoogleOAuth2FailureHandler;
import com.bloodlink.bloodlink_backend.security.GoogleOAuth2SuccessHandler;
import com.bloodlink.bloodlink_backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final CorsConfigurationSource corsConfigurationSource;

    private final GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler;

    private final GoogleOAuth2FailureHandler googleOAuth2FailureHandler;


    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // ==========================
                // CORS
                // ==========================

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource
                        )
                )

                // ==========================
                // CSRF
                // ==========================

                .csrf(csrf ->
                        csrf.disable()
                )

                // ==========================
                // SESSION
                // ==========================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.IF_REQUIRED
                        )
                )

                // ==========================
                // AUTHORIZATION
                // ==========================

                .authorizeHttpRequests(auth -> auth

                        // CORS preflight
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()

                        // Normal login/register
                        .requestMatchers(
                                "/api/auth/**"
                        )
                        .permitAll()

                        // OAuth2 authorization
                        .requestMatchers(
                                "/oauth2/**"
                        )
                        .permitAll()

                        // OAuth2 callback
                        .requestMatchers(
                                "/login/oauth2/**"
                        )
                        .permitAll()

                        // Everything else
                        .anyRequest()
                        .authenticated()
                )

                // ==========================
                // GOOGLE OAUTH2 LOGIN
                // ==========================

                .oauth2Login(oauth2 ->
                        oauth2
                                .successHandler(
                                        googleOAuth2SuccessHandler
                                )
                                .failureHandler(
                                        googleOAuth2FailureHandler
                                )
                )

                // ==========================
                // JWT FILTER
                // ==========================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // =====================================================
    // AUTHENTICATION PROVIDER
    // =====================================================

    @Bean
    public AuthenticationProvider authenticationProvider(
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        customUserDetailsService
                );

        provider.setPasswordEncoder(
                passwordEncoder
        );

        return provider;
    }


    // =====================================================
    // AUTHENTICATION MANAGER
    // =====================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }
}