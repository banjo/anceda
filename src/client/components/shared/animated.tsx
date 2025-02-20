import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { FC, ReactNode } from "react";

type Props = {
    show: boolean;
    children: ReactNode;
} & HTMLMotionProps<"div">;

const defaults = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const Animated: FC<Props> = ({
    show,
    children,
    initial: initialProps,
    animate: animateProps,
    exit: exitProps,
    ...props
}) => (
    <AnimatePresence>
        {show ? (
            <motion.div
                initial={initialProps ?? defaults.initial}
                animate={animateProps ?? defaults.animate}
                exit={exitProps ?? defaults.exit}
                {...props}
            >
                {children}
            </motion.div>
        ) : null}
    </AnimatePresence>
);
