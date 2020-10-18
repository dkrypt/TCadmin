#!/usr/bin/env groovy

def isFeatureBranch = (env.BRANCH_NAME != 'master' && env.BRANCH_NAME != 'dev') ? "true" : "false"
def tcAdminCoreVersion
def imageTag
def imageName = 'tc-admin-app'
pipeline {
    agent none
    environment {
        COMPLIANCEENABLED = true
        PREDIX_DTR = credentials('dtr-predix')
        GEAR_GE_DTR = credentials('gear-ge-dtr-functional-creds')
        DTR_ORG_NAME = 'dig-digiconnect'
        GEAR_GE_ORG_NAME = 'digital-connect'
    }
    parameters {
        string(name: 'BUILD', defaultValue: "true", description: 'Build Docker Image.')
        string(name: 'TEST', defaultValue: "true", description: 'Run Unit Tests')
        string(name: 'SCAN', defaultValue: "false", description: 'Run Sonarqube and OSS Scans.')
        string(name: 'DEPLOY_CF', defaultValue: "true", description: 'Deploy Docker image for PCS Environments.')
        string(name: 'DEPLOY', defaultValue: "true", description: 'Deploy Default Docker image')
    }
    options {
        buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '1', daysToKeepStr: '', numToKeepStr: '15')); timeout(time: 150, unit: 'MINUTES')
    }
    stages {
        stage ('Initialize') {
            agent {
                label 'dind'
            }
            steps {
                script {
                    checkout scm

                    echo "BUILD : ${env.BUILD}"
                    echo "TEST : ${env.TEST}"
                    echo "SCAN : ${env.SCAN}"
                    echo "DEPLOY_CF : ${env.DEPLOY_CF}"
                    echo "DEPLOY : ${env.DEPLOY}"
                    echo "Initializing Build on branch ${env.BRANCH_NAME}"
                    
                    tcAdminCoreVersion = sh(script: 'cat package.json | jq -r \'.["version"]\'',returnStdout: true).trim()
                    if (env.BRANCH_NAME == "dev") {
                        imageTag = "${env.BRANCH_NAME}-${tcAdminCoreVersion}"
                    } else {
                        imageTag = "test-${env.BRANCH_NAME}-${tcAdminCoreVersion}"
                    }
                    echo "Initizalied build with Docker Tag : ${imageTag}"
                }
            }
            post {
                success {
                    echo "Initialization complete."
                }
                failure {
                    echo "Initialization failed."
                    deleteDir()
                }
            }
        }
        stage ('Build') {
            agent {
                docker {
                    image 'node:latest'
                    label 'dind'
                }
            }
            when {
                expression { return env.BUILD == "true"; }
            }
            steps {
                sh 'npm --version'
                sh 'npm install'
            }
            post {
                success {
                    echo "Build Success"
                }
                failure {
                    echo "Build Failed"
                    deleteDir()
                }
            }
        }
        stage ('Test') {
            agent {
                label 'dind'
            }
            when {
                expression { return env.TEST == "true"; }
            }
            steps {
                echo "Unit tests should run under this stage."
            }
            post {
                success {
                    echo "Testing successful"
                }
                failure {
                    echo "Testing unsuccessful"
                    deleteDir()
                }
            }
        }
        stage ('SonarQube Scan') {
            agent {
                docker {
                    image 'skilldlabs/sonar-scanner:3.3'
                    label 'dind'
                    customWorkspace '/root/sonarqube'
                }
            }
            when {
                expression { return env.SCAN == "true"; }
            }
            steps {
                checkout scm
                withSonarQubeEnv('propel-sonar') {
                    sh 'sonar-scanner -X'
                }
            }
            post {
                success {
                    echo "Scan Completed Successfully"
                }
                failure {
                    echo "Scan Unsuccessful"
                }
            }
        }
        stage ('Build, Tag and Push CF Image') {
            agent {
                label 'dind'
            }
            when {
                allOf {
                    expression { return env.BUILD == "true"; }
                    expression { return env.DEPLOY_CF == "true"; }
                }
            }
            steps {
                sh "docker build . \
                    -t dtr.predix.io/${DTR_ORG_NAME}/${imageName}:${imageTag}-cf \
                    -t registry.gear.ge.com/${GEAR_GE_ORG_NAME}/${imageName}:${imageTag}-cf"
                
                sh "docker login https://dtr.predix.io -u ${PREDIX_DTR_USR} -p ${PREDIX_DTR_PSW}"
                sh "docker push dtr.predix.io/${DTR_ORG_NAME}/${imageName}:${imageTag}-cf"

                sh "docker login https://registry.gear.ge.com -u ${GEAR_GE_DTR_USR} -p ${GEAR_GE_DTR_PSW}"
                sh "docker push registry.gear.ge.com/${GEAR_GE_ORG_NAME}/${imageName}:${imageTag}-cf"
            }
            post {
                success {
                    echo 'CF images successfully built and pushed to registry.'
                }
                failure {
                    echo 'CF images build stage failed.'
                    deleteDir()
                }
            }
        }
        stage ('Build, Tag and Push Image') {
            agent {
                label 'dind'
            }
            when {
                allOf {
                    expression { return env.BUILD == "true"; }
                    expression { return env.DEPLOY == "true"; }
                }
            }
            steps {
                sh "docker build . \
                    -t dtr.predix.io/${DTR_ORG_NAME}/${imageName}:${imageTag} \
                    -t registry.gear.ge.com/${GEAR_GE_ORG_NAME}/${imageName}:${imageTag}"
                
                sh "docker login https://dtr.predix.io -u ${PREDIX_DTR_USR} -p ${PREDIX_DTR_PSW}"
                sh "docker push dtr.predix.io/${DTR_ORG_NAME}/${imageName}:${imageTag}"

                sh "docker login https://registry.gear.ge.com -u ${GEAR_GE_DTR_USR} -p ${GEAR_GE_DTR_PSW}"
                sh "docker push registry.gear.ge.com/${GEAR_GE_ORG_NAME}/${imageName}:${imageTag}"
            }
            post {
                success {
                    echo 'Images successfully built and pushed to registry.'
                }
                failure {
                    echo 'Image build stage failed.'
                    deleteDir()
                }
            }
        }
    }
    post {
        success {
            script {
                echo 'The build has completed successfully. Notifying relevant parties...'
                if (!isFeatureBranch) {
                    emailext (
                        subject: "Build Success: ${env.JOB_NAME}",
                        body: "Your pipeline: '${env.JOB_NAME} [${env.BUILD_NUMBER}]': Completed succesfully. Check console output at ${env.BUILD_URL}/console}",
                        to: 'digital.tc.engineering@ge.com',
                        from: 'jenkins-robot@do-not-reply.com',
                        replyTo: 'jenkins-robot@o-not-reply.com'
                    )
                }
            }
        }
        failure {
            script {
                echo 'The build was unsuccessful. Notifying relevant parties...'
                if (!isFeatureBranch) {
                    emailext (
                        subject: "Build Failure: ${env.JOB_NAME}",
                        body: "Your pipeline: '${env.JOB_NAME} [${env.BUILD_NUMBER}]': has an error. Check console output at ${env.BUILD_URL}/console}",
                        to: 'digital.tc.engineering@ge.com',
                        from: 'jenkins-robot@do-not-reply.com',
                        replyTo: 'jenkins-robot@o-not-reply.com'
                    )
                }
            }
        }
    }
}