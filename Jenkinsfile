#!groovy
@Library('sprockets') _
import common
import git
import node

def service = 'xmc-gateway'
def docker_tag = BUILD_TAG.toLowerCase()
def pr = env.CHANGE_ID
def c = new common()
def d = new container()
def n = new node()
def g = new git()
//This will stop all old builds so that things are not running in parallel.
c.stop_previous_builds(env.JOB_NAME, env.BUILD_NUMBER.toInteger())
//This Will choose Node 16.20 from Jenkins Global Tool.
/*
node () {
    nodeCore.defaultPipeline([
        nodeVersion: '16.x'
    ])
     pwd = pwd()
     isPR = core.isPR()
}
if (isPR) {
    node() {
        core.defaultPipeline()
    }
}
*/
pipeline {
    agent any
  tools {
      nodejs '16.x'
}
stages {
        stage ('Set build version') {
          steps {
            sh 'echo "Stage Description: Set build version from package.json"'
            script{
              buildTool = c.getBuildTool()
              props = c.exportProperties(buildTool)
              build_version = readFile('version')
            }
          }
        }
//This Will Create New Tag on SCM
  stage ('Push new tag') {
      steps {
        script {
          try {
            sh 'echo "Makes a github tagged release under a new branch with the same name as the tag version"'
            git url: "git@github.com:SerenovaLLC/${service}"
            sh "git checkout -b build-${BUILD_TAG}"
            if (build_version.contains("SNAPSHOT")) {
              sh "if git tag --list | grep ${build_version}; then git tag -d ${build_version}; git push origin :refs/tags/${build_version}; fi"
            }
            sh "git pull --tag -f"
            sh "git tag -f -a ${build_version} -m 'release ${build_version}, Jenkins tagged ${BUILD_TAG}'"
            sh "git push -f origin ${build_version}"
          } catch (e) {
            sh 'echo "Failed create git tag"'
          }
        }
      }
}
//Pushing to ECR
 stage('Publishing the build to ECR') {
        steps {
          sh 'echo "Stage Description: Sets up docker image for use in following stages"'
          sh "docker build -t xmc-gateway -f Dockerfile ."
          script {
            d.publishDocker("${service}", build_version)
            d.cleanupDocker(service, build_version)
          }
      }
    }
 
}
}
