# Use a base image with JDK
FROM openjdk:17-jdk-slim

# Install tzdata package and configure timezone
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata

# Add a directory for the application
WORKDIR /app

# Copy the JAR file into the container
COPY build/libs/*.jar app.jar

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
