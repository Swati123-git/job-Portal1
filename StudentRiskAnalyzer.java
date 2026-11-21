package com.sms.academic;

import java.util.ArrayList;
import java.util.List;

/**
 * StudentRiskAnalyzer
 * Early Warning Academic Risk Engine
 * Combines continuous evaluation marks (60% weight) and attendance record (40% weight)
 * to flag students requiring academic counseling or faculty mentorship.
 */
public class StudentRiskAnalyzer {

    public enum RiskLevel {
        LOW("Low Risk / On Track", "#10b981"),
        MODERATE("Moderate Risk / Monitor Closely", "#f59e0b"),
        CRITICAL("Critical Risk / Immediate Intervention Required", "#ef4444");

        private final String description;
        private final String colorCode;

        RiskLevel(String description, String colorCode) {
            this.description = description;
            this.colorCode = colorCode;
        }

        public String getDescription() { return description; }
        public String getColorCode() { return colorCode; }
    }

    public static class RiskAssessment {
        private final double compositeScore;
        private final RiskLevel riskLevel;
        private final List<String> warningFlags;
        private final List<String> recommendations;

        public RiskAssessment(double compositeScore, RiskLevel riskLevel, 
                              List<String> warningFlags, List<String> recommendations) {
            this.compositeScore = compositeScore;
            this.riskLevel = riskLevel;
            this.warningFlags = warningFlags;
            this.recommendations = recommendations;
        }

        public double getCompositeScore() { return compositeScore; }
        public RiskLevel getRiskLevel() { return riskLevel; }
        public List<String> getWarningFlags() { return warningFlags; }
        public List<String> getRecommendations() { return recommendations; }

        @Override
        public String toString() {
            return String.format("Risk Assessment: %s (Composite Score: %.1f/100)\nWarnings: %s\nRecommendations: %s",
                    riskLevel.getDescription(), compositeScore, warningFlags, recommendations);
        }
    }

    /**
     * Analyze a student based on attendance and marks
     */
    public static RiskAssessment analyze(double attendancePercentage, double averageMarksPercentage) {
        // Weighted composite score (40% attendance + 60% academic marks)
        double compositeScore = (attendancePercentage * 0.40) + (averageMarksPercentage * 0.60);
        compositeScore = Math.round(compositeScore * 10.0) / 10.0;

        List<String> warnings = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        // Attendance warnings
        if (attendancePercentage < 65.0) {
            warnings.add("Severe attendance deficit (<65%). At risk of exam debarment.");
            recommendations.add("Attend all upcoming scheduled lectures without unexcused absences.");
        } else if (attendancePercentage < 75.0) {
            warnings.add("Attendance is in the warning corridor (65-75%). Medical condonation required.");
            recommendations.add("Obtain attendance recovery approval from the Head of Department.");
        }

        // Marks warnings
        if (averageMarksPercentage < 40.0) {
            warnings.add("Continuous assessment marks below passing threshold (<40%).");
            recommendations.add("Schedule remedial tutorial sessions with course instructors.");
            recommendations.add("Re-attempt weekly practice quizzes and submit pending assignments.");
        } else if (averageMarksPercentage < 55.0) {
            warnings.add("Performance is borderline pass (40-55%). Room for significant improvement.");
            recommendations.add("Focus on fundamental concepts and complete previous years' exam question papers.");
        }

        RiskLevel level;
        if (compositeScore < 50.0 || attendancePercentage < 65.0 || averageMarksPercentage < 40.0) {
            level = RiskLevel.CRITICAL;
            recommendations.add("Urgent: Parent-Teacher-Mentor conference recommended.");
        } else if (compositeScore < 70.0 || attendancePercentage < 75.0 || averageMarksPercentage < 60.0) {
            level = RiskLevel.MODERATE;
            recommendations.add("Assign peer study buddy or student study group.");
        } else {
            level = RiskLevel.LOW;
            recommendations.add("Maintain consistent performance for honors/distinction nomination.");
            recommendations.add("Encourage participation in technical symposiums, hackathons, and certifications.");
        }

        return new RiskAssessment(compositeScore, level, warnings, recommendations);
    }
}
