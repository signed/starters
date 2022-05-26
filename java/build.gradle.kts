plugins {
    id("com.github.ben-manes.versions") version "0.42.0"
    id("se.patrikerdes.use-latest-versions") version "0.2.18"
    java
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter-api:5.9.0-M1")
    testImplementation("org.junit.jupiter:junit-jupiter-params:5.9.0-M1")
    testImplementation("org.assertj:assertj-core:3.22.0")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.9.0-M1")
}

tasks.test {
	useJUnitPlatform()
	testLogging {
		events("passed", "skipped", "failed")
	}
}
