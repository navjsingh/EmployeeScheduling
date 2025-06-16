FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/vacationmanager-*.jar app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
EXPOSE 8080