plugins {
    id("com.github.ben-manes.versions") version "0.21.0"
    id("se.patrikerdes.use-latest-versions") version "0.2.12"
    java
}

repositories {
    mavenCentral()
    jcenter()
}

dependencies {
    "testImplementation"("org.junit.jupiter:junit-jupiter-api:5.5.1")
    "testImplementation"("org.junit.jupiter:junit-jupiter-params:5.5.1")
    "testImplementation"("org.assertj:assertj-core:3.13.0")
    "testRuntimeOnly"("org.junit.jupiter:junit-jupiter-engine:5.5.1")
}
