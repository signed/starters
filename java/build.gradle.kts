plugins {
    id("com.github.ben-manes.versions") version "0.20.0"
    id("se.patrikerdes.use-latest-versions") version "0.2.9"
    java
}

repositories {
    mavenCentral()
    jcenter()
}

dependencies {
    "testImplementation"("org.junit.jupiter:junit-jupiter-api:5.3.1")
    "testImplementation"("org.junit.jupiter:junit-jupiter-params:5.3.1")
    "testImplementation"("org.assertj:assertj-core:3.11.1")
    "testRuntimeOnly"("org.junit.jupiter:junit-jupiter-engine:5.3.1")
}