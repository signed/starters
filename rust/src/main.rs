fn main() {
    let rectangle = Rectangle { width: 8, height: 7 };
    rectangle.can_hold(&rectangle);
    println!("Hello, world! {:?}", rectangle);
}

#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn larger_can_hold_smaller() {
        let larger = Rectangle { width: 8, height: 7 };
        let smaller = Rectangle { width: 5, height: 1 };

        assert!(larger.can_hold(&smaller));
    }

    #[test]
    fn smaller_cannot_hold_larger() {
        let larger = Rectangle { width: 8, height: 7 };
        let smaller = Rectangle { width: 5, height: 1 };

        assert!(!smaller.can_hold(&larger));
    }

    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }

    #[test]
    fn assert_checks_for_true() {
        assert!(true);
    }

    #[test]
    #[ignore]
    fn fail_a_test() {
        panic!("Make this test fail");
    }

    #[test]
    #[should_panic]
    fn check_for_panic() {
        panic!("Make this test fail");
    }
}