plugins {
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