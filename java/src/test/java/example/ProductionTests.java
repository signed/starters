package example;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

class ProductionTests {
    @Test
    void helloWorld() {
        Assertions.assertThat(new Production()).isNotNull();
    }
}