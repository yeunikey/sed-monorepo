import Categories from "./categories/Categories";
import Container from "./Container";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { ReactNode } from "react";

interface ViewProps {
    className?: string,
    container?: boolean,

    children?: ReactNode
}

function View({ container, className, children }: ViewProps) {
    return (
        <div className="relative flex flex-col">

            <Header></Header>

            <div className={'relative flex flex-col min-h-[75vh] grow'}>
                <Categories></Categories>

                {container
                    ? (
                        <Container className={(className ? className : '')}>
                            {children}
                        </Container>
                    )
                    : (
                        <div className={(className ? className : '')}>
                            {children}
                        </div>
                    )}
            </div>

            <Footer></Footer>
        </div>
    )
}

export default View;