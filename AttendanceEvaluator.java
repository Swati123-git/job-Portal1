package com.sms.academic;

/**
 * AttendanceEvaluator
 * Evaluates student attendance records according to statutory university/AICTE guidelines:
 * - >= 75%: Cleared for Semester Examinations
 * - 65% - 74.9%: Eligible with Condonation on Medical/Extenuating grounds
 * - < 65%: Ineligible / Detained in the Course
 */
public class AttendanceEvaluator {

    public enum AttendanceStatus {
        CLEARED("Cleared for Examination"),
        CONDONATION_REQUIRED("Condonation Required (Medical/Dean Approval)"),
        DETAINED("Detained / Critical Shortage");

        private final String label;
        AttendanceStatus(String label) { this.label = label; }
        public String getLabel() { return label; }
    }

    public static class AttendanceResult {
        private final int totalClasses;
        private final int attendedClasses;
        private final double attendancePercentage;
        private final AttendanceStatus status;
        private final int classesNeededFor75;
        private final String advisoryMessage;

        public AttendanceResult(int totalClasses, int attendedClasses, double percentage, 
                                AttendanceStatus status, int classesNeededFor75, String message) {
            this.totalClasses = totalClasses;
            this.attendedClasses = attendedClasses;
            this.attendancePercentage = percentage;
            this.status = status;
            this.classesNeededFor75 = classesNeededFor75;
            this.advisoryMessage = message;
        }

        public int getTotalClasses() { return totalClasses; }
        public int getAttendedClasses() { return attendedClasses; }
        public double getAttendancePercentage() { return attendancePercentage; }
        public AttendanceStatus getStatus() { return status; }
        public int getClassesNeededFor75() { return classesNeededFor75; }
        public String getAdvisoryMessage() { return advisoryMessage; }

        @Override
        public String toString() {
            return String.format("Attendance: %.1f%% (%d/%d) - Status: %s - %s",
                    attendancePercentage, attendedClasses, totalClasses, status.getLabel(), advisoryMessage);
        }
    }

    /**
     * Evaluate attendance percentage and determine exam eligibility
     */
    public static AttendanceResult evaluate(int attendedClasses, int totalClasses) {
        if (totalClasses <= 0) {
            return new AttendanceResult(0, 0, 100.0, AttendanceStatus.CLEARED, 0, "No classes conducted yet.");
        }

        double percentage = (double) attendedClasses / totalClasses * 100.0;
        percentage = Math.round(percentage * 100.0) / 100.0;

        AttendanceStatus status;
        String advisory;
        int classesNeeded = 0;

        if (percentage >= 75.0) {
            status = AttendanceStatus.CLEARED;
            advisory = "Satisfies statutory AICTE/University requirement. Admit card cleared.";
        } else if (percentage >= 65.0) {
            status = AttendanceStatus.CONDONATION_REQUIRED;
            advisory = "Below 75%. Medical certificates or special HOD dispensation required to write exams.";
            // Calculate how many consecutive classes are needed to reach 75%
            // (attended + x) / (total + x) >= 0.75 => x >= (0.75 * total - attended) / 0.25
            classesNeeded = (int) Math.ceil((0.75 * totalClasses - attendedClasses) / 0.25);
            if (classesNeeded < 0) classesNeeded = 0;
        } else {
            status = AttendanceStatus.DETAINED;
            advisory = "Critical attendance deficit. Student is at imminent risk of course detention.";
            classesNeeded = (int) Math.ceil((0.75 * totalClasses - attendedClasses) / 0.25);
            if (classesNeeded < 0) classesNeeded = 0;
        }

        return new AttendanceResult(totalClasses, attendedClasses, percentage, status, classesNeeded, advisory);
    }
}
