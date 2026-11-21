package com.sms.academic;

/**
 * GradeCalculator
 * Calculates 10-point scale GPA, SGPA, letter grades, and academic classification
 * based on standard UGC/AICTE university grading guidelines.
 */
public class GradeCalculator {

    public static class GradeInfo {
        private final String grade;
        private final double gradePoints;
        private final String classification;
        private final boolean isPassed;

        public GradeInfo(String grade, double gradePoints, String classification, boolean isPassed) {
            this.grade = grade;
            this.gradePoints = gradePoints;
            this.classification = classification;
            this.isPassed = isPassed;
        }

        public String getGrade() { return grade; }
        public double getGradePoints() { return gradePoints; }
        public String getClassification() { return classification; }
        public boolean isPassed() { return isPassed; }

        @Override
        public String toString() {
            return String.format("Grade: %s (Points: %.1f) - %s [Passed: %s]",
                    grade, gradePoints, classification, isPassed);
        }
    }

    /**
     * Compute letter grade and points from percentage
     */
    public static GradeInfo calculateGrade(double percentage) {
        if (percentage >= 90.0) {
            return new GradeInfo("O", 10.0, "Outstanding / First Class with Distinction", true);
        } else if (percentage >= 80.0) {
            return new GradeInfo("A+", 9.0, "Excellent / First Class with Distinction", true);
        } else if (percentage >= 70.0) {
            return new GradeInfo("A", 8.0, "Very Good / First Class", true);
        } else if (percentage >= 60.0) {
            return new GradeInfo("B+", 7.0, "Good / First Class", true);
        } else if (percentage >= 50.0) {
            return new GradeInfo("B", 6.0, "Above Average / Second Class", true);
        } else if (percentage >= 40.0) {
            return new GradeInfo("C", 5.0, "Pass Class", true);
        } else {
            return new GradeInfo("F", 0.0, "Fail / Reappear Required", false);
        }
    }

    /**
     * Compute Semester Grade Point Average (SGPA)
     * SGPA = Sum(Credit_i * GradePoint_i) / Sum(Credit_i)
     */
    public static double computeSGPA(double[] credits, double[] marksObtained, double[] maxMarks) {
        if (credits == null || marksObtained == null || maxMarks == null ||
            credits.length != marksObtained.length || marksObtained.length != maxMarks.length || credits.length == 0) {
            throw new IllegalArgumentException("Invalid array parameters for SGPA calculation.");
        }

        double totalWeightedPoints = 0.0;
        double totalCredits = 0.0;

        for (int i = 0; i < credits.length; i++) {
            double percentage = (marksObtained[i] / maxMarks[i]) * 100.0;
            GradeInfo grade = calculateGrade(percentage);
            totalWeightedPoints += (credits[i] * grade.getGradePoints());
            totalCredits += credits[i];
        }

        if (totalCredits == 0) return 0.0;
        return Math.round((totalWeightedPoints / totalCredits) * 100.0) / 100.0;
    }
}
