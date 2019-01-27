pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                echo 'Getting source code...'
                checkout scm
                }
            }

        stage('Build') {
            steps {
                echo 'Building...'
                sh 'npm i'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                sh 'npm run test'
            }
        }
    }
}
