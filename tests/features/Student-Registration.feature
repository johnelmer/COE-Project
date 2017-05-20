Feature: Student Registration

    As the secretary,
    I want to register a student to the system
    so that the college can have his personal information.

@watch
Scenario: Register a student with complete details
  Given that I am in the student registration page
  When I enter my <Elmer> for firstName
    And press the register button
  Then I should be able to see a confirmation of the registration

@watch
Scenario: Register a student with incomplete details
  Given that I am in the student registration page
  When I enter the _______ in the form
    And press the register button
  Then I should see an error information in the screen

@watch
Scenario: Register student with incorrect information
  Given that I am in the student registration page
  When I enter the _________ in the form
    And press the register button
  Then I should see an error information in the screen
